#!/usr/bin/env python3
"""Prüft ad-hoc-signierte macOS-Bundles ohne Apple-Werkzeuge.

Geprüft wird, was macOS beim Start kontrolliert:
- jede Mach-O-Datei: Hash jeder Code-Seite stimmt mit dem CodeDirectory überein
- Haupt-Binary eines Bundles: Hash von Info.plist (Slot 1) und _CodeSignature/CodeResources (Slot 3)
- CodeResources: Hash jeder versiegelten Datei, Ziel jedes Symlinks, cdhash jedes eingebetteten Bundles
Aufruf: tools/mac-verify.py "dist/mac-arm64/Gymi-Trainer ZH.app"
"""
import hashlib, os, plistlib, struct, sys

CSMAGIC_EMBEDDED = 0xFADE0CC0
CSMAGIC_CD = 0xFADE0C02
HASHES = {1: hashlib.sha1, 2: hashlib.sha256}


def code_dirs(path):
    """Liefert (blob, felder) für jedes CodeDirectory der (dünnen, 64-Bit) Mach-O-Datei."""
    data = open(path, 'rb').read()
    magic = struct.unpack_from('<I', data, 0)[0]
    if magic != 0xFEEDFACF:
        raise ValueError('kein dünnes 64-Bit-Mach-O (magic %x)' % magic)
    ncmds = struct.unpack_from('<I', data, 16)[0]
    off = 32; sig = None
    for _ in range(ncmds):
        cmd, size = struct.unpack_from('<II', data, off)
        if cmd == 0x1D:
            sig = struct.unpack_from('<II', data, off + 8)
        off += size
    if not sig:
        raise ValueError('keine Signatur')
    so, ss = sig
    blob = data[so:so + ss]
    m, length, count = struct.unpack_from('>III', blob, 0)
    if m != CSMAGIC_EMBEDDED:
        raise ValueError('SuperBlob fehlt')
    out = []
    for i in range(count):
        typ, o = struct.unpack_from('>II', blob, 12 + 8 * i)
        bm, bl = struct.unpack_from('>II', blob, o)
        if bm == CSMAGIC_CD:
            cd = blob[o:o + bl]
            version, flags, hash_off, ident_off, n_special, n_code, code_limit, hash_size, hash_type, platform, page_log = struct.unpack_from('>IIIIIIIBBBB', cd, 8)
            out.append((cd, dict(flags=flags, hash_off=hash_off, n_special=n_special, n_code=n_code, code_limit=code_limit, hash_size=hash_size, hash_type=hash_type, page=1 << page_log if page_log else 0, ident=cd[ident_off:cd.index(b'\0', ident_off)].decode())))
    return data, out


def check_binary(path, bundle_root=None):
    data, cds = code_dirs(path)
    if not cds:
        return ['kein CodeDirectory']
    errs = []
    for cd, f in cds:
        H = HASHES.get(f['hash_type'])
        if not H:
            errs.append('unbekannter Hashtyp %d' % f['hash_type']); continue
        page = f['page'] or f['code_limit']
        for i in range(f['n_code']):
            chunk = data[i * page:min((i + 1) * page, f['code_limit'])]
            want = cd[f['hash_off'] + i * f['hash_size']:f['hash_off'] + (i + 1) * f['hash_size']]
            if H(chunk).digest()[:f['hash_size']] != want:
                errs.append('Seite %d: Hash stimmt nicht' % i); break
        if bundle_root:  # Spezial-Slots: 1 = Info.plist, 3 = CodeResources
            for slot, rel in ((1, 'Info.plist'), (3, '_CodeSignature/CodeResources')):
                if slot > f['n_special']:
                    errs.append('Slot %d fehlt' % slot); continue
                want = cd[f['hash_off'] - slot * f['hash_size']:f['hash_off'] - (slot - 1) * f['hash_size']]
                fp = os.path.join(bundle_root, 'Contents', rel) if os.path.isdir(os.path.join(bundle_root, 'Contents')) else os.path.join(bundle_root, 'Resources' if rel == 'Info.plist' else '', rel)
                if not os.path.exists(fp):
                    errs.append('%s fehlt' % rel); continue
                if H(open(fp, 'rb').read()).digest()[:f['hash_size']] != want:
                    errs.append('Slot %d (%s): Hash stimmt nicht' % (slot, rel))
    return errs


def cdhash(path):
    _, cds = code_dirs(path)
    best = [c for c in cds if c[1]['hash_type'] == 2] or cds
    cd, f = best[0]
    return HASHES[f['hash_type']](cd).digest()[:20]


def main_binary(bundle):
    c = os.path.join(bundle, 'Contents')
    if os.path.isdir(c):  # App
        info = plistlib.load(open(os.path.join(c, 'Info.plist'), 'rb'))
        return os.path.join(c, 'MacOS', info['CFBundleExecutable']), c
    info = plistlib.load(open(os.path.join(bundle, 'Resources', 'Info.plist'), 'rb'))  # Framework-Version
    return os.path.join(bundle, info['CFBundleExecutable']), bundle


def check_bundle(bundle, report):
    exe, base = main_binary(bundle)
    errs = check_binary(exe, bundle)
    res = plistlib.load(open(os.path.join(base, '_CodeSignature', 'CodeResources'), 'rb'))
    n = 0
    for rel, spec in res.get('files2', {}).items():
        p = os.path.join(base, rel)
        if not isinstance(spec, dict):
            spec = {'hash': spec}
        if 'symlink' in spec:
            if not os.path.islink(p) or os.readlink(p) != spec['symlink']:
                errs.append('Symlink falsch: ' + rel)
        elif 'cdhash' in spec:
            nb = os.path.realpath(p)
            nexe = nb if os.path.isfile(nb) else main_binary(nb)[0]  # eingebettetes Bundle oder einzelnes Programm
            if cdhash(nexe) != spec['cdhash']:
                errs.append('cdhash falsch: ' + rel)
        elif 'hash2' in spec:
            if not os.path.isfile(p) or hashlib.sha256(open(p, 'rb').read()).digest() != spec['hash2']:
                errs.append('Datei-Hash falsch: ' + rel)
        n += 1
    report.append((os.path.relpath(bundle, os.path.dirname(sys.argv[1].rstrip('/'))), n, errs))


def walk(app):
    report = []
    bundles = [app]
    for root, dirs, files in os.walk(app):
        for d in dirs:
            p = os.path.join(root, d)
            if os.path.islink(p):
                continue
            if d.endswith('.app') or (os.path.basename(root) == 'Versions' and d != 'Current'):
                bundles.append(p)
    for b in bundles:
        try:
            check_bundle(b, report)
        except Exception as e:  # noqa
            report.append((b, 0, ['Fehler: %s' % e]))
    # alle Mach-O-Dateien: Code-Seiten
    nmacho = 0; bad = []
    for root, dirs, files in os.walk(app):
        for fn in files:
            p = os.path.join(root, fn)
            if os.path.islink(p):
                continue
            with open(p, 'rb') as fh:
                head = fh.read(4)
            if head == b'\xcf\xfa\xed\xfe':
                nmacho += 1
                e = check_binary(p)
                if e:
                    bad.append((p, e))
    return report, nmacho, bad


if __name__ == '__main__':
    report, nmacho, bad = walk(sys.argv[1].rstrip('/'))
    total_err = 0
    for b, n, errs in report:
        print(('OK    ' if not errs else 'FEHLER') + ' %-75s %4d versiegelte Einträge' % (b[-75:], n))
        for e in errs[:5]:
            print('        ' + e)
        total_err += len(errs)
    print('Mach-O-Dateien: %d, mit falschen Code-Hashes: %d' % (nmacho, len(bad)))
    for p, e in bad:
        print('  ' + p + ': ' + '; '.join(e))
    sys.exit(1 if total_err or bad else 0)
