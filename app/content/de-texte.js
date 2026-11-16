// Lesetexte mit Aufgaben im Stil der Sprachprüfung (eigene Texte, frei erweiterbar).
// figur: o = 12 Adjektive, a = Indizes der 4 passenden. aussagen: a = r (richtig) | f (falsch) | k (keine Angabe).
import { addItems } from '../js/engine/db.js';

addItems('text', [
  {
    id: 'text-sprung', title: 'Der Sprung', kind: 'Erzählung',
    text: [
      'Von unten sah der Fünfmeterturm aus wie jedes andere Gerüst. Von oben war er ein Abgrund. Mira stand am Rand des Brettes, die Zehen um die raue Kante gekrallt, und starrte auf das Wasser, das plötzlich sehr weit weg und sehr hart aussah.',
      '«Na los!», rief ihr Bruder Levin vom Beckenrand. Neben ihm standen seine Freunde. Einer hielt das Handy hoch. Mira hatte am Mittagstisch behauptet, der Fünfer sei für sie ein Kinderspiel. Jetzt bereute sie jeden Buchstaben dieses Satzes.',
      'Ihr Herz schlug so laut, dass sie meinte, man müsse es bis zur Liegewiese hören. Sie zählte bis drei. Sie zählte noch einmal bis drei. Hinter ihr auf der Leiter räusperte sich ein Junge.',
      '«Ich springe heute nicht», sagte sie. Ihre Stimme klang fester, als sie erwartet hatte. Sie drehte sich um und stieg die Leiter hinunter, Sprosse für Sprosse, vorbei an dem Jungen, der ihr schweigend Platz machte. Unten grinsten Levins Freunde. Levin grinste nicht. Er warf ihr das Badetuch zu und sagte nur: «Pommes?»',
      'Am nächsten Morgen war das Bad fast leer. Nebel hing über dem Becken und der Bademeister spritzte gähnend die Platten ab. Mira hatte niemandem gesagt, wohin sie ging. Sie stieg hinauf, ohne stehen zu bleiben, denn sie wusste: Wenn sie stehen blieb, würde sie wieder zu zählen beginnen.',
      'Oben schaute sie nicht nach unten, sondern geradeaus, zu den Pappeln hinter dem Zaun. Dann machte sie einen Schritt ins Leere.',
      'Das Wasser schlug über ihr zusammen, kalt und laut. Als sie auftauchte, war niemand da, der klatschte. Der Bademeister hatte nicht einmal aufgeschaut. Mira schwamm zum Rand, legte die Arme auf die warmen Platten und lachte leise vor sich hin. Zu Hause würde sie nichts erzählen. Dieser Sprung gehörte ihr allein.'
    ],
    figur: { name: 'Mira', o: ['entschlossen', 'selbstkritisch', 'eigenständig', 'mutig', 'gleichgültig', 'rachsüchtig', 'bequem', 'geschwätzig', 'hinterlistig', 'geizig', 'unterwürfig', 'neidisch'], a: [0, 1, 2, 3], why: 'entschlossen: Sie steigt hinauf, ohne stehen zu bleiben (Absatz 5). selbstkritisch: Sie bereut ihre Behauptung (Absatz 2). eigenständig: Sie geht allein und erzählt niemandem davon (Absatz 5 und 7). mutig: Sie sagt vor allen «Ich springe heute nicht» und springt am nächsten Tag (Absatz 4 und 6).' },
    zuordnen: [
      { satz: 'Jemand macht mit der Stimme ein Geräusch, um auf sich aufmerksam zu machen.', wort: ['räusperte'], zeilen: '3' }, { satz: 'Eine sehr tiefe Stelle, in die man stürzen kann.', wort: ['Abgrund'], zeilen: '1' },
      { satz: 'Etwas ist so einfach, dass es keine Mühe macht.', wort: ['Kinderspiel'], zeilen: '2' }, { satz: 'Eine einzelne Stufe einer Leiter.', wort: ['Sprosse'], zeilen: '4' },
      { satz: 'Sie wünschte, sie hätte es nicht gesagt.', wort: ['bereute'], zeilen: '2' }, { satz: 'Jemand ist so müde, dass er den Mund weit öffnet.', wort: ['gähnend'], zeilen: '5' }
    ],
    aussagen: [
      { s: 'Mira hat am Mittagstisch gesagt, der Sprung sei für sie leicht.', a: 'r', why: 'Absatz 2: «ein Kinderspiel».' }, { s: 'Mira steigt die Leiter wieder hinunter, statt zu springen.', a: 'r', why: 'Absatz 4.' },
      { s: 'Levin macht sich nach dem Abstieg über Mira lustig.', a: 'f', why: 'Absatz 4: «Levin grinste nicht.»' }, { s: 'Am nächsten Morgen ist das Bad voller Leute.', a: 'f', why: 'Absatz 5: «fast leer».' },
      { s: 'Mira hat ihrer Mutter gesagt, dass sie ins Bad geht.', a: 'f', why: 'Absatz 5: Sie hat es niemandem gesagt.' }, { s: 'Der Bademeister klatscht nach dem Sprung.', a: 'f', why: 'Absatz 7: Er hat nicht einmal aufgeschaut.' },
      { s: 'Mira ist dreizehn Jahre alt.', a: 'k', why: 'Ihr Alter wird nicht genannt.' }, { s: 'Levin ist älter als Mira.', a: 'k', why: 'Der Text sagt nur «ihr Bruder».' },
      { s: 'Oben schaut Mira zu den Bäumen hinter dem Zaun.', a: 'r', why: 'Absatz 6: zu den Pappeln.' }, { s: 'Mira will zu Hause von ihrem Sprung erzählen.', a: 'f', why: 'Absatz 7: «Zu Hause würde sie nichts erzählen.»' },
      { s: 'Der Junge auf der Leiter beschimpft Mira.', a: 'f', why: 'Absatz 4: Er macht ihr schweigend Platz.' }, { s: 'Das Bad liegt an einem See.', a: 'k', why: 'Dazu steht nichts im Text.' }
    ],
    fragen: [
      { q: 'Warum steigt Mira am zweiten Tag die Leiter hinauf, ohne stehen zu bleiben?', model: 'Sie weiss: Wenn sie stehen bleibt, beginnt sie wieder zu zählen und zögert. Sie will der Angst keine Zeit lassen.', check: ['Ich nenne das Zählen oder Zögern als Grund.', 'Ich erkläre, dass sie der Angst keine Zeit geben will.'] },
      { q: 'Wie verhält sich Levin, nachdem Mira nicht gesprungen ist? Was zeigt das über ihn?', model: 'Er grinst nicht wie seine Freunde, wirft ihr das Badetuch zu und fragt nur «Pommes?». Er macht ihr keinen Vorwurf und lenkt ab. Das zeigt: Er hält zu ihr und ist rücksichtsvoll.', check: ['Ich beschreibe sein Verhalten mit einer Stelle aus dem Text.', 'Ich sage, was das über ihn zeigt (hält zu ihr, taktvoll).'] },
      { q: 'Erkläre den letzten Satz: «Dieser Sprung gehörte ihr allein.»', skill: 'D19', model: 'Mira ist für sich selbst gesprungen, nicht um jemandem etwas zu beweisen. Niemand hat zugeschaut, und sie will es niemandem erzählen. Der Erfolg ist wertvoll, weil er nur ihr gehört.', check: ['Ich erkläre: Sie springt für sich, nicht für andere.', 'Ich belege das mit dem Text (kein Publikum, erzählt nichts).'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Echten Mut beweist man für sich selbst, nicht für Zuschauer.', 'Wer angibt, wird am Ende immer ausgelacht.', 'Geschwister halten in jeder Lage zusammen.', 'Im Schwimmbad sollte man nie allein vom Turm springen.'], a: 0, why: 'Vor Publikum springt Mira nicht, allein und ohne Zuschauer springt sie.' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Ohne Publikum', 'Der gemeine Bruder', 'Ein Unfall im Schwimmbad', 'Der strenge Bademeister'], a: 0, why: 'Entscheidend ist, dass beim zweiten Mal niemand zuschaut.' },
      { q: 'Warum schaut der Bademeister im Text «nicht einmal» auf?', o: ['Es zeigt: Für alle anderen ist der Sprung unwichtig, er zählt nur für Mira.', 'Es zeigt, dass der Bademeister seine Arbeit schlecht macht.', 'Es baut Spannung auf einen Unfall auf.', 'Es zeigt, dass Mira etwas Verbotenes tut.'], a: 0, why: 'Der Sprung braucht keine Zeugen.' }
    ]
  },
  {
    id: 'text-uhr', title: 'Die Taschenuhr', kind: 'Erzählung',
    text: [
      'Die Taschenuhr meines Grossvaters lag immer am selben Ort: in der obersten Schublade seines Schreibtischs, auf einem Stück blauem Samt. Anfassen durfte ich sie nicht. «Die hat schon meinem Vater die Zeit gesagt», pflegte er zu sagen, und damit war die Sache erledigt.',
      'An jenem Nachmittag war Grossvater im Garten. Ich wollte die Uhr nur einmal aufziehen, nur einmal das feine Ticken hören. Sie war schwerer, als ich gedacht hatte. Sie rutschte mir aus den Fingern, schlug auf die Tischkante und blieb auf dem Teppich liegen. Im Glas war ein Sprung, dünn wie ein Haar.',
      'Ich legte sie zurück auf den Samt, mit dem Sprung nach unten, und schob die Schublade zu. Beim Abendessen brachte ich keinen Bissen hinunter. Grossvater erzählte von den Schnecken im Salat, und ich nickte an den falschen Stellen.',
      'Drei Tage lang wich ich dem Schreibtisch aus. Ich schlief schlecht. Einmal träumte ich, die Uhr ticke so laut, dass das ganze Haus davon erwachte.',
      'Am vierten Tag hielt ich es nicht mehr aus. Ich ging in den Garten, wo Grossvater Bohnen anband, und sagte alles in einem einzigen, viel zu schnellen Satz. Dann wartete ich auf das Donnerwetter.',
      'Grossvater band die Bohne fertig an. Er wischte sich die Hände an der Schürze ab und sah mich lange an. «Den Sprung im Glas», sagte er schliesslich, «den hat sie seit vierzig Jahren. Der stammt von mir. Ich war damals ungefähr so alt wie du.»',
      'Ich starrte ihn an. «Und dein Vater?»',
      '«Dem habe ich es nie gesagt.» Er bückte sich nach der Schnur. «Du warst schneller als ich. Halt mal hier fest.»',
      'Ich hielt die Stange, und zum ersten Mal seit Tagen bekam ich wieder richtig Luft.'
    ],
    figur: { name: 'dem Kind, das erzählt', o: ['neugierig', 'schuldbewusst', 'aufrichtig', 'erleichtert', 'gleichgültig', 'schadenfroh', 'habgierig', 'überheblich', 'träge', 'vergesslich', 'jähzornig', 'verschwenderisch'], a: [0, 1, 2, 3], why: 'neugierig: Es will das Ticken hören (Absatz 2). schuldbewusst: Es kann nicht essen und schläft schlecht (Absatz 3 und 4). aufrichtig: Es gesteht alles (Absatz 5). erleichtert: Es bekommt wieder richtig Luft (Absatz 9).' },
    zuordnen: [
      { satz: 'Ein weicher Stoff mit feinen, kurzen Härchen.', wort: ['Samt'], zeilen: '1' }, { satz: 'Ein heftiges Schimpfen.', wort: ['Donnerwetter'], zeilen: '5' },
      { satz: 'Ein Kleidungsstück, das man bei der Arbeit über den Kleidern trägt.', wort: ['Schürze'], zeilen: '6' }, { satz: 'Ein sehr feiner Riss.', wort: ['Sprung'], zeilen: '2' },
      { satz: 'So viel Essen, wie man auf einmal in den Mund nimmt.', wort: ['Bissen'], zeilen: '3' }, { satz: 'Darüber wird nicht mehr gesprochen: Die Sache ist …', wort: ['erledigt'], zeilen: '1' }
    ],
    aussagen: [
      { s: 'Die Uhr gehörte früher dem Urgrossvater des Kindes.', a: 'r', why: 'Absatz 1: Sie hat schon dem Vater des Grossvaters die Zeit gesagt.' }, { s: 'Das Kind lässt die Uhr absichtlich fallen.', a: 'f', why: 'Absatz 2: Sie rutscht ihm aus den Fingern.' },
      { s: 'Das Kind legt die Uhr so zurück, dass man den Sprung nicht sieht.', a: 'r', why: 'Absatz 3: mit dem Sprung nach unten.' }, { s: 'Das Kind gesteht noch am selben Abend.', a: 'f', why: 'Absatz 5: erst am vierten Tag.' },
      { s: 'Der Grossvater schimpft laut mit dem Kind.', a: 'f', why: 'Absatz 6: Er bleibt ruhig.' }, { s: 'Der Sprung im Glas ist etwa vierzig Jahre alt.', a: 'r', why: 'Absatz 6.' },
      { s: 'Der Grossvater hat seinem Vater den Schaden gestanden.', a: 'f', why: 'Absatz 8: «Dem habe ich es nie gesagt.»' }, { s: 'Die Uhr läuft nach dem Sturz nicht mehr.', a: 'k', why: 'Dazu steht nichts im Text.' },
      { s: 'Das Kind ist ein Junge.', a: 'k', why: 'Das Geschlecht wird nicht genannt.' }, { s: 'Der Grossvater arbeitet im Garten, als das Kind gesteht.', a: 'r', why: 'Absatz 5: Er bindet Bohnen an.' },
      { s: 'Die Grossmutter weiss von dem Sprung.', a: 'k', why: 'Eine Grossmutter kommt im Text nicht vor.' }
    ],
    fragen: [
      { q: 'Warum bringt das Kind beim Abendessen «keinen Bissen hinunter»?', model: 'Es hat ein schlechtes Gewissen: Es hat die Uhr heimlich genommen und glaubt, sie beschädigt zu haben. Es hat Angst, entdeckt zu werden.', check: ['Ich nenne das schlechte Gewissen oder die Angst.', 'Ich nenne den Grund (Uhr heimlich genommen, Sprung im Glas).'] },
      { q: 'Wie zeigt der Text, dass das Kind unter seinem Geheimnis leidet? Nenne 2 Stellen.', model: 'Es kann nicht essen, nickt an den falschen Stellen, weicht dem Schreibtisch aus, schläft schlecht und träumt vom lauten Ticken.', check: ['Ich nenne eine erste passende Stelle.', 'Ich nenne eine zweite passende Stelle.'] },
      { q: 'Was meint der Grossvater mit «Du warst schneller als ich»?', skill: 'D19', model: 'Das Kind hat nach 4 Tagen gestanden. Er selbst hat es seinem Vater in 40 Jahren nie gesagt. Er anerkennt damit den Mut des Kindes.', check: ['Ich vergleiche: Kind gesteht nach 4 Tagen, Grossvater nie.', 'Ich sage, dass der Satz ein Lob ist.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage am besten?', o: ['Ein Geständnis braucht Mut und befreit.', 'Alte Gegenstände sollte man wegschliessen.', 'Grossväter verzeihen ihren Enkeln alles.', 'Wer etwas kaputt macht, muss es bezahlen.'], a: 0, why: 'Das Kind leidet, bis es gesteht, und bekommt danach «wieder richtig Luft».' },
      { q: 'Warum reagiert der Grossvater so ruhig?', o: ['Er hat als Kind denselben Fehler gemacht und nie gestanden.', 'Die Uhr ist ihm nicht wichtig.', 'Er hat nicht richtig zugehört.', 'Er will das Kind später bestrafen.'], a: 0, why: 'Absatz 6 und 8.' },
      { q: 'Was bedeutet der Schlusssatz «bekam ich wieder richtig Luft»?', o: ['Die Last des Geheimnisses ist weg.', 'Das Kind war erkältet.', 'Im Garten ist die Luft besser als im Haus.', 'Das Kind ist weggerannt.'], a: 0, why: 'Bildhafte Sprache für Erleichterung.' }
    ]
  },
  {
    id: 'text-bus', title: 'Platz 14', kind: 'Erzählung',
    text: [
      'Im Schulbus der Linie 31 hatte jeder seinen Platz. Niemand hatte das je so bestimmt, aber alle hielten sich daran. Elins Platz war die Nummer 14, rechts am Fenster. Der Sitz daneben blieb frei, und das war ihr recht.',
      'An einem Montag im November setzte sich ein fremder Junge neben sie. Er sagte nichts, sie sagte nichts. Er hatte eine Mütze bis fast über die Augen gezogen und roch nach Regen.',
      'So ging es die ganze Woche. Am Freitag hielt er ihr wortlos einen seiner Kopfhörer hin. Elin zögerte, dann steckte sie ihn ins Ohr. Es lief ein Lied in einer Sprache, die sie nicht kannte, traurig und fröhlich zugleich.',
      'Von da an teilten sie jeden Morgen zwanzig Minuten Musik. Sie kannte seinen Namen nicht. Sie wusste nur, dass er an der Haltestelle Mühlebach einstieg, dass er Lieder mit Trommeln mochte und dass er beim Zuhören mit dem Zeigefinger auf sein Knie klopfte.',
      'Im Januar blieb der Sitz neben ihr an einem Dienstag leer. Am Mittwoch auch. Elin ertappte sich dabei, wie sie bei Mühlebach den Hals reckte. Die zwanzig Minuten waren plötzlich sehr lang und sehr still. Sie ärgerte sich über sich selbst. Sie hatte doch immer gern allein gesessen.',
      'Am Donnerstag stieg er wieder ein, blass, mit einem Schal um den Hals. Jemand aus der vierten Klasse wollte sich gerade auf den freien Platz fallen lassen. «Besetzt», sagte Elin, lauter als nötig, und legte ihre Tasche auf den Sitz.',
      'Der Junge setzte sich. Er holte die Kopfhörer hervor, hielt inne und sagte mit heiserer Stimme: «Ich heisse übrigens Darian.»',
      '«Elin», sagte Elin. Dann hörten sie Musik.'
    ],
    figur: { name: 'Elin', o: ['zurückhaltend', 'aufmerksam', 'einzelgängerisch', 'entschlossen', 'geschwätzig', 'angeberisch', 'streitsüchtig', 'faul', 'schadenfroh', 'habgierig', 'verschwenderisch', 'leichtsinnig'], a: [0, 1, 2, 3], why: 'zurückhaltend: Sie sagt tagelang nichts (Absatz 2 und 3). aufmerksam: Sie kennt seine Haltestelle und seine Gewohnheiten (Absatz 4). einzelgängerisch: Der freie Sitz ist ihr recht (Absatz 1). entschlossen: Sie verteidigt den Platz (Absatz 6).' },
    zuordnen: [
      { satz: 'Ohne etwas zu sagen.', wort: ['wortlos'], zeilen: '3' }, { satz: 'Sie wartete einen Moment, weil sie unsicher war.', wort: ['zögerte'], zeilen: '3' },
      { satz: 'Sie merkte plötzlich, dass sie etwas Unerwartetes tat.', wort: ['ertappte'], zeilen: '5' }, { satz: 'Seine Stimme klang rau.', wort: ['heiserer', 'heiser'], zeilen: '7' },
      { satz: 'Ohne Farbe im Gesicht.', wort: ['blass'], zeilen: '6' }, { satz: 'Sie streckte den Hals, um besser zu sehen.', wort: ['reckte'], zeilen: '5' }
    ],
    aussagen: [
      { s: 'Die Sitzordnung im Bus wurde vom Fahrer festgelegt.', a: 'f', why: 'Absatz 1: Niemand hatte das je bestimmt.' }, { s: 'Der Junge setzt sich im November zum ersten Mal neben Elin.', a: 'r', why: 'Absatz 2.' },
      { s: 'Am ersten Tag stellen sich die beiden einander vor.', a: 'f', why: 'Absatz 2: Beide sagen nichts.' }, { s: 'Das erste Lied ist in einer Sprache, die Elin nicht kennt.', a: 'r', why: 'Absatz 3.' },
      { s: 'Der Junge steigt an der Haltestelle Mühlebach ein.', a: 'r', why: 'Absatz 4.' }, { s: 'Der Junge mag Lieder mit Trommeln.', a: 'r', why: 'Absatz 4.' },
      { s: 'Im Januar fehlt der Junge an zwei Tagen.', a: 'r', why: 'Absatz 5 und 6: Dienstag und Mittwoch, am Donnerstag ist er wieder da.' }, { s: 'Der Junge hatte eine Grippe.', a: 'k', why: 'Er ist blass und heiser. Welche Krankheit er hatte, steht nicht im Text.' },
      { s: 'Elin hält den Platz neben sich für den Jungen frei.', a: 'r', why: 'Absatz 6: «Besetzt».' }, { s: 'Der Junge kommt aus einem anderen Land.', a: 'k', why: 'Dazu steht nichts im Text.' },
      { s: 'Elin nennt ihren Namen als Erste.', a: 'f', why: 'Absatz 7 und 8: Zuerst sagt Darian seinen Namen.' }, { s: 'Darian geht in dieselbe Klasse wie Elin.', a: 'k', why: 'Dazu steht nichts im Text.' }
    ],
    fragen: [
      { q: 'Warum ärgert sich Elin in Absatz 5 über sich selbst?', model: 'Sie merkt, dass sie den Jungen vermisst und nach ihm Ausschau hält. Das passt nicht zu ihrem Bild von sich: Sie sass doch immer gern allein.', check: ['Ich sage, dass sie ihn vermisst oder nach ihm Ausschau hält.', 'Ich erkläre den Widerspruch (sie sass immer gern allein).'] },
      { q: 'Woran erkennt man, dass Elin den Jungen genau beobachtet hat? Nenne 2 Beispiele.', model: 'Sie kennt seine Haltestelle, weiss, dass er Lieder mit Trommeln mag und dass er mit dem Zeigefinger auf sein Knie klopft. Sie bemerkt seine Mütze und den Geruch nach Regen.', check: ['Ich nenne ein erstes Beispiel aus dem Text.', 'Ich nenne ein zweites Beispiel aus dem Text.'] },
      { q: 'Warum sagt Elin «Besetzt» lauter als nötig?', skill: 'D19', model: 'Es ist ihr wichtig, dass der Platz für den Jungen frei bleibt. Die Lautstärke verrät ihre Gefühle (Freude, Erleichterung), die sie sonst nicht zeigt.', check: ['Ich erkläre, dass ihr der Platz für den Jungen wichtig ist.', 'Ich deute die Lautstärke als Zeichen ihrer Gefühle.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage am besten?', o: ['Freundschaft kann ohne viele Worte entstehen.', 'Im Bus sollte man feste Plätze einführen.', 'Musik hören im Bus stört die anderen.', 'Wer neu ist, muss sich zuerst vorstellen.'], a: 0, why: 'Die beiden teilen wochenlang Musik, bevor sie ihre Namen kennen.' },
      { q: 'Welche Wirkung hat der Schluss «Dann hörten sie Musik»?', o: ['Er zeigt: Auch mit Namen braucht ihre Freundschaft wenig Worte.', 'Er zeigt, dass die beiden sich langweilen.', 'Er lässt offen, ob Elin den Jungen mag.', 'Er zeigt, dass Elin beleidigt ist.'], a: 0, why: 'Das Wichtige bleibt gleich wie vorher.' },
      { q: 'Welcher Titel passt ebenfalls?', o: ['Zwanzig Minuten', 'Der laute Bus', 'Streit um einen Sitzplatz', 'Ein Montag im Sommer'], a: 0, why: 'Die gemeinsamen 20 Minuten Musik stehen im Mittelpunkt.' }
    ]
  },
  {
    id: 'text-markt', title: 'Sechs Franken', kind: 'Erzählung',
    text: [
      'Jeden Samstag verkaufte Noemi auf dem Markt die Konfitüre ihrer Grossmutter. Zwetschge, Quitte, Holunder, jedes Glas für sechs Franken. Das Preisschild hatte sie selbst geschrieben, mit grünem Filzstift und einem kleinen Rahmen aus Punkten.',
      'Gegen Mittag blieb ein Mann in einem hellen Mantel vor dem Tisch stehen. Er drehte ein Glas Quitte in der Hand, hielt es gegen das Licht und stellte es wieder hin. «Sechs Franken? Für das bisschen?» Er lächelte, aber nur mit dem Mund. «Ich gebe dir drei. Du bist ja noch ein Kind, du brauchst das Geld nicht.»',
      'Noemi spürte, wie ihr das Blut in die Wangen stieg. Sie dachte an die Grossmutter, die im Herbst stundenlang Quitten schälte, bis ihre Finger gelb waren. «Es kostet sechs», sagte sie.',
      '«Vier. Mein letztes Wort.» Der Mann zog sein Portemonnaie hervor, als sei die Sache entschieden.',
      '«Es kostet sechs», wiederholte Noemi. Ihre Hände zitterten, also verschränkte sie sie hinter dem Rücken. «Sie müssen es ja nicht kaufen.»',
      'Der Mann zog die Augenbrauen hoch. Einen Moment lang sah es aus, als wolle er etwas Scharfes erwidern. Dann steckte er das Portemonnaie ein und ging kopfschüttelnd davon.',
      'Noemi atmete aus. Erst jetzt bemerkte sie die alte Frau, die die ganze Zeit neben dem Stand gewartet hatte. Die Frau stellte drei Gläser Quitte auf den Tisch und legte eine Zwanzigernote daneben.',
      '«Der Rest ist für die Köchin», sagte sie. «Und richte ihr aus: Ihre Enkelin verkauft gut.»',
      'Am Abend zählte Noemi das Geld zweimal. Dann nahm sie den grünen Filzstift und zog den Rahmen um die Sechs noch einmal nach, etwas dicker als zuvor.'
    ],
    figur: { name: 'Noemi', o: ['standhaft', 'beherrscht', 'loyal', 'sorgfältig', 'unterwürfig', 'gierig', 'eingebildet', 'gleichgültig', 'geschwätzig', 'jähzornig', 'nachlässig', 'leichtgläubig'], a: [0, 1, 2, 3], why: 'standhaft: Sie bleibt beim Preis (Absatz 3 und 5). beherrscht: Sie bleibt höflich, obwohl ihre Hände zittern (Absatz 5). loyal: Sie denkt an die Arbeit der Grossmutter (Absatz 3). sorgfältig: Sie gestaltet das Preisschild und zählt das Geld zweimal (Absatz 1 und 9).' },
    zuordnen: [
      { satz: 'Ein kleines Behältnis für Geld.', wort: ['Portemonnaie'], zeilen: '4' }, { satz: 'Dasselbe noch einmal sagen.', wort: ['wiederholte'], zeilen: '5' },
      { satz: 'Auf eine Aussage antworten.', wort: ['erwidern'], zeilen: '6' }, { satz: 'Die Schale einer Frucht entfernen.', wort: ['schälte'], zeilen: '3' },
      { satz: 'Die Hände übereinanderlegen und festhalten.', wort: ['verschränkte'], zeilen: '5' }, { satz: 'Er bewegte den Kopf hin und her, weil er nicht einverstanden war.', wort: ['kopfschüttelnd'], zeilen: '6' }
    ],
    aussagen: [
      { s: 'Noemi verkauft drei Sorten Konfitüre.', a: 'r', why: 'Absatz 1: Zwetschge, Quitte, Holunder.' }, { s: 'Noemi hat die Konfitüre selbst gekocht.', a: 'f', why: 'Absatz 1: Es ist die Konfitüre der Grossmutter.' },
      { s: 'Der Mann bietet zuerst drei Franken.', a: 'r', why: 'Absatz 2.' }, { s: 'Noemi senkt den Preis auf fünf Franken.', a: 'f', why: 'Sie bleibt bei sechs.' },
      { s: 'Der Mann kauft am Ende ein Glas zum vollen Preis.', a: 'f', why: 'Absatz 6: Er geht davon.' }, { s: 'Die alte Frau bezahlt mehr, als die drei Gläser kosten.', a: 'r', why: '3 Gläser kosten 18 Franken, sie gibt 20.' },
      { s: 'Die alte Frau kennt Noemis Grossmutter persönlich.', a: 'k', why: 'Sie weiss von der Köchin, aber ob sie sie kennt, steht nicht im Text.' }, { s: 'Der Mann ist reich.', a: 'k', why: 'Dazu steht nichts im Text.' },
      { s: 'Noemi versteckt ihre Hände, weil sie zittern.', a: 'r', why: 'Absatz 5.' }, { s: 'Noemi steht jeden Samstag auf dem Markt.', a: 'r', why: 'Absatz 1.' },
      { s: 'Am Abend ändert Noemi den Preis auf dem Schild.', a: 'f', why: 'Absatz 9: Sie zieht nur den Rahmen nach.' }, { s: 'Die Grossmutter ist an diesem Tag krank.', a: 'k', why: 'Dazu steht nichts im Text.' }
    ],
    fragen: [
      { q: 'Warum denkt Noemi in Absatz 3 an ihre Grossmutter?', model: 'Sie erinnert sich an die viele Arbeit: stundenlang Quitten schälen, bis die Finger gelb sind. Darum ist der Preis gerecht, und sie will ihn nicht senken.', check: ['Ich nenne die Arbeit der Grossmutter.', 'Ich erkläre, dass der Preis darum gerecht ist.'] },
      { q: 'Wie versucht der Mann, Noemi unter Druck zu setzen? Nenne 2 Mittel.', model: 'Er macht die Ware schlecht («für das bisschen»). Er sagt, ein Kind brauche das Geld nicht. Er nennt ein «letztes Wort» und zieht schon das Portemonnaie hervor, als sei alles entschieden.', check: ['Ich nenne ein erstes Mittel mit Textstelle.', 'Ich nenne ein zweites Mittel mit Textstelle.'] },
      { q: 'Was bedeutet es, dass Noemi am Schluss den Rahmen um die Sechs dicker nachzieht?', skill: 'D19', model: 'Sie ist jetzt sicher, dass der Preis richtig ist. Der dickere Rahmen zeigt ihr gewachsenes Selbstvertrauen: Sie steht zu ihrem Preis.', check: ['Ich deute den Rahmen als Zeichen (Selbstvertrauen, Bestätigung).', 'Ich beziehe mich auf das Erlebnis mit dem Mann oder der alten Frau.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage am besten?', o: ['Wer den Wert einer Arbeit kennt, lässt sich nicht einschüchtern.', 'Kinder sollten auf dem Markt nichts verkaufen.', 'Mit Feilschen spart man immer Geld.', 'Alte Menschen sind grosszügiger als junge.'], a: 0, why: 'Noemi bleibt fest, weil sie an die Arbeit der Grossmutter denkt.' },
      { q: '«Er lächelte, aber nur mit dem Mund.» Was sagt das über den Mann?', o: ['Sein Lächeln ist nicht echt.', 'Er hat Zahnschmerzen.', 'Er findet Noemi sympathisch.', 'Er ist schüchtern.'], a: 0, why: 'Ein echtes Lächeln erreicht auch die Augen.' },
      { q: 'Welche Rolle spielt die alte Frau?', o: ['Sie bestätigt Noemi darin, dass es richtig war, fest zu bleiben.', 'Sie will den Preis ebenfalls drücken.', 'Sie ist die Grossmutter und hat alles geplant.', 'Sie beschwert sich über den Preis.'], a: 0, why: 'Sie kauft 3 Gläser, gibt Trinkgeld und lobt Noemi.' }
    ]
  },
  {
    id: 'text-gaehnen', title: 'Warum Gähnen ansteckt', kind: 'Sachtext',
    text: [
      'Kaum gähnt jemand im Zug, gähnt bald der halbe Wagen. Gähnen ist ansteckend, das weiss jedes Kind. Warum das so ist, konnte die Forschung lange nicht erklären, und ganz gelöst ist das Rätsel bis heute nicht.',
      'Früher glaubte man, wer gähne, habe zu wenig Sauerstoff im Blut. Diese Erklärung gilt als widerlegt. In Versuchen gähnten Menschen nicht häufiger, wenn die Luft im Raum weniger Sauerstoff enthielt.',
      'Heute vermuten viele Forschende, dass Gähnen das Gehirn kühlt. Beim Gähnen strömt kühlere Luft durch Mund und Nase, und der gedehnte Kiefer regt die Durchblutung an. Dazu passt eine Beobachtung: Wer sich einen kühlen Lappen auf die Stirn legt, gähnt seltener.',
      'Und die Ansteckung? Sie hat wohl mit Mitgefühl zu tun. Menschen lassen sich am leichtesten von Personen anstecken, die ihnen nahestehen: zuerst von Familienmitgliedern, dann von Freunden, zuletzt von Fremden. Kleine Kinder lassen sich noch kaum anstecken. Erst mit etwa vier oder fünf Jahren, wenn sie sich besser in andere hineinversetzen können, gähnen sie mit.',
      'Übrigens gähnen nicht nur Menschen. Auch Hunde lassen sich anstecken, sogar von ihren Besitzern. Selbst wer nur über das Gähnen liest, verspürt oft den Drang dazu. Falls Sie also gerade den Mund weit aufsperren: Das liegt nicht an diesem Text. Jedenfalls nicht nur.'
    ],
    zuordnen: [
      { satz: 'Etwas wurde als falsch nachgewiesen.', wort: ['widerlegt'], zeilen: '2' }, { satz: 'Die Fähigkeit, die Gefühle anderer zu teilen.', wort: ['Mitgefühl'], zeilen: '4' },
      { satz: 'Ein starkes inneres Bedürfnis, etwas zu tun.', wort: ['Drang'], zeilen: '5' }, { satz: 'Eine Frage, auf die man die Antwort noch sucht.', wort: ['Rätsel'], zeilen: '1' },
      { satz: 'Es geht leicht von einer Person auf andere über.', wort: ['ansteckend'], zeilen: '1' }
    ],
    aussagen: [
      { s: 'Die Forschung hat vollständig geklärt, warum Gähnen ansteckt.', a: 'f', why: 'Absatz 1: Ganz gelöst ist das Rätsel nicht.' }, { s: 'Sauerstoffmangel gilt heute als Ursache des Gähnens.', a: 'f', why: 'Absatz 2: Diese Erklärung gilt als widerlegt.' },
      { s: 'Mit einem kühlen Lappen auf der Stirn gähnt man seltener.', a: 'r', why: 'Absatz 3.' }, { s: 'Von Fremden lässt man sich am leichtesten anstecken.', a: 'f', why: 'Absatz 4: zuletzt von Fremden.' },
      { s: 'Zweijährige Kinder gähnen meist noch nicht mit.', a: 'r', why: 'Absatz 4: erst mit etwa 4 oder 5 Jahren.' }, { s: 'Hunde lassen sich vom Gähnen ihrer Besitzer anstecken.', a: 'r', why: 'Absatz 5.' },
      { s: 'Auch Katzen lassen sich anstecken.', a: 'k', why: 'Katzen kommen im Text nicht vor.' }, { s: 'Menschen gähnen am häufigsten am Abend.', a: 'k', why: 'Dazu steht nichts im Text.' },
      { s: 'Schon das Lesen über das Gähnen kann Gähnen auslösen.', a: 'r', why: 'Absatz 5.' }, { s: 'Beim Gähnen strömt wärmere Luft durch Mund und Nase.', a: 'f', why: 'Absatz 3: kühlere Luft.' }
    ],
    fragen: [
      { q: 'Wie erklärt der Text, dass kleine Kinder sich noch kaum anstecken lassen?', model: 'Die Ansteckung hat mit Mitgefühl zu tun. Erst mit etwa 4 bis 5 Jahren können sich Kinder besser in andere hineinversetzen.', check: ['Ich nenne das Mitgefühl (sich hineinversetzen).', 'Ich nenne das Alter, ab dem das gelingt.'] },
      { q: 'Welche Beobachtung stützt die Vermutung, dass Gähnen das Gehirn kühlt?', model: 'Wer sich einen kühlen Lappen auf die Stirn legt, gähnt seltener.', check: ['Ich nenne die Beobachtung mit dem kühlen Lappen.'] }
    ],
    mc: [
      { q: 'Welche Absicht hat der Text vor allem?', o: ['Auf unterhaltsame Art informieren', 'Zum Kauf eines Produkts überreden', 'Vor einer Krankheit warnen', 'Eine erfundene Geschichte erzählen'], a: 0, why: 'Der Text erklärt Forschungsergebnisse in lockerem Ton.' },
      { q: 'Welche Wirkung hat der Schluss «Jedenfalls nicht nur.»?', o: ['Er ist ein Scherz: Der Text selbst könnte das Gähnen ausgelöst haben.', 'Er zeigt, dass sich die Forschung geirrt hat.', 'Er fordert dazu auf, mehr zu schlafen.', 'Er fasst alle Ergebnisse zusammen.'], a: 0, why: 'Pointe: Lesen über Gähnen steckt an (Absatz 5).' },
      { q: 'Welche Aussage ist im Text ausdrücklich als Vermutung formuliert?', o: ['Gähnen kühlt das Gehirn.', 'Gähnen ist ansteckend.', 'Die Sauerstoff-Erklärung ist widerlegt.', 'Auch Hunde lassen sich anstecken.'], a: 0, why: 'Absatz 3: «Heute vermuten viele Forschende …»' }
    ]
  }
]);

// Weitere Erzählungen (ergänzt): je 1 Figur, Wortzuordnung, Aussagen, offene Fragen und Deutungsfragen
addItems('text', [
  {
    id: 'text-sprachnachricht', title: 'Die Sprachnachricht', kind: 'Erzählung',
    text: [
      'Seit Grossvater Emil ein Smartphone besass, klingelte bei Noah jeden Abend das Telefon. «Wie schicke ich ein Foto?», fragte er. Oder: «Warum ist der Bildschirm plötzlich schwarz?» Noah erklärte es ihm, zuerst freundlich, dann knapp, schliesslich mit einem Seufzer, den man bis nach Winterthur hören musste.',
      '«Grosspapi, ich habe es dir schon dreimal gezeigt», sagte er an einem Dienstag. Er sass vor seinen Mathematikaufgaben, und die Gleichungen wollten einfach nicht aufgehen. Am anderen Ende blieb es einen Moment still. Dann lachte der Grossvater. «Beim vierten Mal sitzt es. Du hast fürs Velofahren auch fünf Anläufe gebraucht.»',
      'Noah legte auf, ohne Tschüss zu sagen. Später lag er im Bett und hörte, wie der Regen gegen das Fenster prasselte. Er dachte an den Sommer, in dem der Grossvater neben ihm hergerannt war, eine Hand am Gepäckträger, bis Noah allein fuhr, ohne es zu merken.',
      'Danach rief der Grossvater nicht mehr an. Eine ganze Woche lang nicht. Noah redete sich ein, das sei gut so. Endlich hatte er seine Ruhe. Trotzdem schaute er öfter auf sein Handy, als er zugeben wollte.',
      'Am Sonntag kam eine Sprachnachricht, elf Minuten lang. Noah verdrehte die Augen und drückte auf Abspielen. Zuerst hörte er nur ein Rascheln, dann ein Räuspern. «Das ist die Geschichte von der Kuh, die in den Zürichsee wollte», begann der Grossvater. «Ich habe sie dir erzählt, als du vier warst. Du wolltest sie jeden Abend hören.»',
      'Noah setzte sich auf. Die Geschichte war genau so, wie er sie in Erinnerung hatte, nur den Schluss hatte er vergessen. Am Ende sagte der Grossvater: «Ich habe herausgefunden, wie man so etwas aufnimmt. Ganz allein, stell dir vor. Es kommen noch mehr. Du musst nicht antworten.»',
      'Noah antwortete trotzdem. Er tippte lange und löschte alles wieder. Dann drückte er auf das Mikrofon und sagte: «Grosspapi, am Samstag zeige ich dir, wie man Videos macht. Und diesmal so oft, wie du willst.»'
    ],
    figur: { name: 'Grossvater Emil', o: ['hartnäckig', 'humorvoll', 'geduldig', 'rücksichtsvoll', 'gleichgültig', 'ungeduldig', 'eitel', 'geizig', 'ängstlich', 'prahlerisch', 'faul', 'hochnäsig'], a: [0, 1, 2, 3], why: 'hartnäckig: «Beim vierten Mal sitzt es», er lernt das Aufnehmen allein (Absatz 2 und 6). humorvoll: Er lacht und erinnert an die fünf Anläufe beim Velofahren (Absatz 2). geduldig: Er rannte neben Noah her, bis dieser allein fuhr (Absatz 3). rücksichtsvoll: Er ruft nicht mehr an und schreibt «Du musst nicht antworten» (Absatz 4 und 6).' },
    zuordnen: [
      { satz: 'Ein hörbares Ausatmen, wenn man genervt oder traurig ist.', wort: ['Seufzer'], zeilen: '1' }, { satz: 'Kurz und ohne viele Worte (eine Antwort).', wort: ['knapp'], zeilen: '1' },
      { satz: 'Versuche, etwas Neues zu schaffen.', wort: ['Anläufe'], zeilen: '2' }, { satz: 'Der Regen schlug mit vielen kleinen, lauten Tropfen auf.', wort: ['prasselte'], zeilen: '3' },
      { satz: 'Das Gestell hinten am Velo, auf das man Taschen legt.', wort: ['Gepäckträger'], zeilen: '3' }, { satz: 'Ein leises Geräusch, wenn sich Papier oder Stoff bewegt.', wort: ['Rascheln'], zeilen: '5' }
    ],
    aussagen: [
      { s: 'Seit der Grossvater ein Smartphone hat, ruft er Noah jeden Abend an.', a: 'r', why: 'Absatz 1.' }, { s: 'Noah erklärt dem Grossvater von Anfang an alles unfreundlich.', a: 'f', why: 'Absatz 1: «zuerst freundlich».' },
      { s: 'Am Dienstag sitzt Noah an seinen Mathematikaufgaben.', a: 'r', why: 'Absatz 2.' }, { s: 'Der Grossvater ist am Telefon beleidigt und schimpft.', a: 'f', why: 'Absatz 2: Er lacht.' },
      { s: 'Noah hat das Velofahren beim ersten Versuch gelernt.', a: 'f', why: 'Absatz 2: «fünf Anläufe».' }, { s: 'Nach dem Gespräch am Dienstag ruft der Grossvater eine Woche lang nicht an.', a: 'r', why: 'Absatz 4.' },
      { s: 'In dieser Woche schaut Noah kaum auf sein Handy.', a: 'f', why: 'Absatz 4: öfter, als er zugeben wollte.' }, { s: 'Die Sprachnachricht ist elf Minuten lang.', a: 'r', why: 'Absatz 5.' },
      { s: 'Der Grossvater wohnt in Winterthur.', a: 'k', why: 'Winterthur steht nur in einem Vergleich. Wo jemand wohnt, steht nicht im Text.' }, { s: 'Der Grossvater hat die Geschichte von der Kuh selbst erfunden.', a: 'k', why: 'Der Text sagt nur, dass er sie erzählt hat.' },
      { s: 'Noah erinnert sich an den Schluss der Geschichte.', a: 'f', why: 'Absatz 6: Den Schluss hatte er vergessen.' }, { s: 'Der Grossvater hat die Aufnahme ohne Hilfe gemacht.', a: 'r', why: 'Absatz 6: «Ganz allein».' },
      { s: 'Noah antwortet mit einer geschriebenen Nachricht.', a: 'f', why: 'Absatz 7: Er löscht den Text und spricht ins Mikrofon.' }, { s: 'Noahs Eltern hören die Sprachnachricht auch.', a: 'k', why: 'Die Eltern kommen im Text nicht vor.' }
    ],
    fragen: [
      { q: 'Warum legt Noah am Dienstag auf, ohne Tschüss zu sagen?', model: 'Er ist gestresst, weil die Gleichungen nicht aufgehen, und genervt, weil er dem Grossvater dasselbe schon zum vierten Mal erklären soll.', check: ['Ich nenne den Stress mit den Mathematikaufgaben.', 'Ich nenne den Ärger über das wiederholte Erklären.'] },
      { q: 'Woran denkt Noah im Bett? Warum ist diese Erinnerung wichtig für die Geschichte?', model: 'Er erinnert sich, wie der Grossvater beim Velofahren neben ihm herrannte, bis er allein fahren konnte. Er merkt: Der Grossvater war damals geduldig mit ihm, er selbst ist es jetzt nicht.', check: ['Ich beschreibe die Erinnerung an das Velofahren.', 'Ich erkläre den Gegensatz: damals Geduld des Grossvaters, jetzt Noahs Ungeduld.'] },
      { q: 'Erkläre den letzten Satz: «Und diesmal so oft, wie du willst.»', skill: 'D19', model: 'Noah verspricht, geduldig zu sein. Er hat gemerkt, dass er vorher ungeduldig war, und will es wiedergutmachen.', check: ['Ich erkläre: Noah verspricht Geduld.', 'Ich zeige den Bezug zu seinem früheren Verhalten.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Geduld, die man selbst bekommen hat, kann man zurückgeben.', 'Ältere Menschen sollten keine Smartphones benutzen.', 'Sprachnachrichten sind besser als Telefonanrufe.', 'Wer Hausaufgaben macht, darf nicht gestört werden.'], a: 0, why: 'Der Grossvater war beim Velofahren geduldig, am Schluss verspricht Noah ihm dieselbe Geduld.' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Beim vierten Mal sitzt es', 'Der kaputte Bildschirm', 'Ein Streit am Sonntag', 'Die Gleichung'], a: 0, why: 'Der Satz des Grossvaters fasst zusammen, worum es geht: Geduld beim Lernen.' },
      { q: 'Warum schickt der Grossvater ausgerechnet die Geschichte von der Kuh?', o: ['Er erinnert Noah an die Zeit, in der er sich Zeit für ihn genommen hat.', 'Er will zeigen, dass er besser erzählt als Noah.', 'Ihm ist keine andere Geschichte eingefallen.', 'Er möchte, dass Noah ihm die Geschichte erklärt.'], a: 0, why: 'Noah wollte sie als Kind jeden Abend hören.' }
    ]
  },
  {
    id: 'text-pass', title: 'Der Pass', kind: 'Erzählung',
    text: [
      'Noch drei Minuten. Es stand 1:1, und auf der Tribüne des Sportplatzes Wiesental schrien die Eltern so laut, als ginge es um die Weltmeisterschaft. Leonie wischte sich den Schweiss aus den Augen. Sie war die Torschützin ihres Teams, so stand es jedenfalls in jedem Matchbericht der Lokalzeitung. Heute hatte sie noch kein Tor geschossen.',
      'Seit Wochen hatte sie für diesen Final geübt, auch an den Tagen, an denen kein Training war. Allein hatte sie Bälle gegen die Garagenwand gekickt, bis sich der Nachbar beschwerte. Sie wollte dieses Tor. Sie wollte es mehr als alles andere.',
      'Dann kam der Ball. Leonie nahm ihn mit der Brust an, drehte sich und sah das Tor vor sich. Zwei Verteidigerinnen rannten auf sie zu. Links, ganz allein, stand Alina. Alina war erst seit dem Frühling im Team, sprach im Garderobenraum kaum ein Wort und hatte in der ganzen Saison noch nie getroffen.',
      'Leonie hatte nur einen Augenblick Zeit. Sie hätte schiessen können. Vielleicht wäre der Ball hineingegangen, vielleicht auch nicht. Aber Alina hatte freie Bahn. Leonie spielte den Ball flach nach links.',
      'Alina erschrak so sehr, dass sie den Ball beinahe verpasste. Dann schoss sie, ohne lange zu zielen. Der Ball prallte an den Innenpfosten und sprang ins Netz.',
      'Was danach geschah, wusste Leonie später nicht mehr genau. Sie erinnerte sich an einen Haufen jubelnder Spielerinnen, an das Gras, das ihr am Knie klebte, und an Alina, die mitten im Haufen weinte und gleichzeitig lachte.',
      'In der Garderobe kam die Trainerin zu Leonie. «Das war der beste Pass der Saison», sagte sie. Leonie zuckte mit den Schultern. «Sie stand einfach besser.» Dann packte sie ihre Sachen und ging hinaus. Vor dem Ausgang wartete Alina. «Danke», sagte sie leise. Es war das erste Mal, dass Alina sie von sich aus ansprach.'
    ],
    figur: { name: 'Leonie', o: ['ehrgeizig', 'selbstlos', 'bescheiden', 'aufmerksam', 'schüchtern', 'eingebildet', 'faul', 'neidisch', 'ängstlich', 'unhöflich', 'launisch', 'schadenfroh'], a: [0, 1, 2, 3], why: 'ehrgeizig: Sie übt auch ohne Training und will das Tor mehr als alles andere (Absatz 2). selbstlos: Sie passt, statt selbst zu schiessen (Absatz 4). bescheiden: «Sie stand einfach besser» (Absatz 7). aufmerksam: Trotz Druck sieht sie, dass Alina frei steht (Absatz 3).' },
    zuordnen: [
      { satz: 'Der Teil eines Sportplatzes, auf dem die Zuschauer sitzen.', wort: ['Tribüne'], zeilen: '1' }, { satz: 'Ein kurzer Text in der Zeitung über ein Spiel.', wort: ['Matchbericht'], zeilen: '1' },
      { satz: 'Er sagte, dass ihn etwas stört.', wort: ['beschwerte'], zeilen: '2' }, { satz: 'Die Spielerinnen, die das eigene Tor schützen sollen.', wort: ['Verteidigerinnen'], zeilen: '3' },
      { satz: 'Ein ganz kurzer Moment.', wort: ['Augenblick'], zeilen: '4' }, { satz: 'Der Ball schlug hart gegen etwas und sprang zurück.', wort: ['prallte'], zeilen: '5' }
    ],
    aussagen: [
      { s: 'Kurz vor Schluss steht es unentschieden.', a: 'r', why: 'Absatz 1: 1:1, noch drei Minuten.' }, { s: 'Leonie hat in diesem Spiel schon ein Tor geschossen.', a: 'f', why: 'Absatz 1: Heute noch kein Tor.' },
      { s: 'Leonie hat auch an Tagen ohne Training geübt.', a: 'r', why: 'Absatz 2.' }, { s: 'Der Nachbar hat Leonie beim Üben geholfen.', a: 'f', why: 'Absatz 2: Er beschwerte sich.' },
      { s: 'Alina spielt schon seit mehreren Jahren im Team.', a: 'f', why: 'Absatz 3: erst seit dem Frühling.' }, { s: 'Alina hatte in dieser Saison schon zwei Tore geschossen.', a: 'f', why: 'Absatz 3: noch nie getroffen.' },
      { s: 'Der Ball trifft den Pfosten, bevor er ins Tor geht.', a: 'r', why: 'Absatz 5: Innenpfosten.' }, { s: 'Leonies Eltern sitzen auf der Tribüne.', a: 'k', why: 'Es steht nur «die Eltern», nicht, ob Leonies Eltern dabei sind.' },
      { s: 'Die Trainerin lobt Leonies Pass.', a: 'r', why: 'Absatz 7.' }, { s: 'Das Team gewinnt den Final.', a: 'k', why: 'Das Tor fällt drei Minuten vor Schluss. Wie das Spiel endet, steht nicht im Text.' },
      { s: 'Alina bedankt sich bei Leonie.', a: 'r', why: 'Absatz 7.' }, { s: 'Die Lokalzeitung berichtet über diesen Final.', a: 'k', why: 'Der Text nennt nur frühere Matchberichte.' }
    ],
    fragen: [
      { q: 'Warum spielt Leonie den Ball zu Alina, obwohl sie das Tor unbedingt selbst schiessen wollte?', model: 'Zwei Verteidigerinnen greifen Leonie an, Alina steht frei. Leonie stellt den Erfolg des Teams über ihren eigenen Wunsch.', check: ['Ich nenne die Spielsituation (Alina frei, zwei Verteidigerinnen).', 'Ich erkläre: Das Team ist ihr wichtiger als ihr eigenes Tor.'] },
      { q: 'Was bedeutet das Tor für Alina? Belege mit dem Text.', model: 'Es ist ihr erstes Tor der Saison. Sie weint und lacht gleichzeitig mitten im Haufen und spricht Leonie danach zum ersten Mal von sich aus an. Sie gehört jetzt dazu.', check: ['Ich nenne ihre Gefühle mit einer Stelle aus dem Text.', 'Ich erkläre, was sich für Alina ändert (erstes Tor, spricht Leonie an).'] },
      { q: 'Erkläre Leonies Antwort: «Sie stand einfach besser.»', skill: 'D19', model: 'Leonie spielt ihren Anteil herunter. Sie will kein Lob und tut so, als sei der Pass selbstverständlich gewesen.', check: ['Ich erkläre, dass Leonie das Lob nicht annimmt.', 'Ich nenne die Eigenschaft dahinter (bescheiden).'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Manchmal zeigt man Grösse, wenn man anderen den Erfolg überlässt.', 'Wer am meisten trainiert, schiesst die meisten Tore.', 'Neue Spielerinnen haben es in einem Team immer schwer.', 'Ein Final ist wichtiger als jedes andere Spiel.'], a: 0, why: 'Leonie verzichtet auf ihr Tor, damit Alina trifft.' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Der beste Pass der Saison', 'Die verlorene Saison', 'Streit in der Garderobe', 'Der wütende Nachbar'], a: 0, why: 'So nennt die Trainerin die entscheidende Szene.' },
      { q: 'Warum erzählt der Text, dass Leonie nach dem Tor vieles nicht mehr weiss?', o: ['Es zeigt, wie überwältigend der Moment war.', 'Es zeigt, dass Leonie verletzt wurde.', 'Es zeigt, dass Leonie das Tor egal ist.', 'Es erklärt, warum sie zu spät nach Hause kam.'], a: 0, why: 'Nur einzelne Bilder bleiben: der Jubel, das Gras, Alinas Tränen.' }
    ]
  },
  {
    id: 'text-baeckerei', title: 'Zehn Sandwiches', kind: 'Erzählung',
    text: [
      'Um halb sieben am Morgen roch die Bäckerei Gerber nach warmem Zopf und frischem Kaffee. Sara band die Schürze zweimal um die Taille, weil sie ihr viel zu gross war. Es war ihr erster Tag als Ferienaushilfe, und Frau Gerber hatte ihr nur einen Satz mit auf den Weg gegeben: «Der Kunde hat nicht immer recht, aber er hat immer Hunger.»',
      'Die ersten zwei Stunden gingen schnell vorbei. Sara füllte Gipfeli in Papiersäcke, zählte Wechselgeld ab und merkte sich, dass Herr Ammann jeden Tag ein Ruchbrot und zwei Nussgipfel kaufte und dazu einen Witz erzählte, über den nur er selbst lachte.',
      'Um neun stand plötzlich ein Mann im Anzug vor der Theke. Er telefonierte und tippte gleichzeitig mit dem Finger auf die Glasscheibe. «Zehn Sandwiches, sofort. Ich habe gestern bestellt.» Sara suchte im Bestellbuch. Für gestern stand dort nichts, für heute auch nicht.',
      '«Das kann nicht sein», sagte der Mann laut. «Ich habe mit einer jungen Frau gesprochen.» Hinter ihm wurde die Schlange länger. Jemand seufzte. Sara spürte, wie ihr das Blut in die Wangen stieg. Frau Gerber stand in der Backstube und hatte die Hände voller Teig.',
      'Sara atmete tief durch. «Ihre Bestellung finde ich nicht», sagte sie ruhig. «Aber ich kann Ihnen jetzt sechs Sandwiches geben. Die anderen vier mache ich frisch. Wo arbeiten Sie?» – «Gleich gegenüber.» – «Dann bringe ich sie Ihnen in zehn Minuten hinüber.»',
      'Der Mann starrte sie an, als hätte er mit Streit gerechnet und wüsste nun nicht, was er mit seiner Wut anfangen sollte. «Zweiter Stock», murmelte er schliesslich und bezahlte.',
      'Zehn Minuten später stieg Sara die Treppe des Bürohauses hinauf, die Papiertüte fest im Arm. Als sie zurückkam, stand Frau Gerber in der Tür und wischte sich das Mehl von den Händen. Sie hatte alles durch das kleine Fenster der Backstube gesehen. «Morgen», sagte sie, «schreibst du die Bestellungen ins Buch.» Sara wusste nicht, ob das eine Belohnung oder eine Strafe war. Aber sie lächelte.'
    ],
    figur: { name: 'Sara', o: ['besonnen', 'einfallsreich', 'hilfsbereit', 'aufmerksam', 'frech', 'gleichgültig', 'schadenfroh', 'faul', 'eingebildet', 'launisch', 'unzuverlässig', 'geizig'], a: [0, 1, 2, 3], why: 'besonnen: Sie atmet tief durch und bleibt ruhig (Absatz 5). einfallsreich: sechs Sandwiches sofort, vier frisch (Absatz 5). hilfsbereit: Sie bringt die Sandwiches ins Büro (Absatz 5 und 7). aufmerksam: Sie merkt sich, was Herr Ammann jeden Tag kauft (Absatz 2).' },
    zuordnen: [
      { satz: 'Ein geflochtenes Brot.', wort: ['Zopf'], zeilen: '1' }, { satz: 'Eine Person, die in den Ferien für kurze Zeit mitarbeitet.', wort: ['Ferienaushilfe'], zeilen: '1' },
      { satz: 'Das Geld, das man zurückbekommt, wenn man zu viel bezahlt.', wort: ['Wechselgeld'], zeilen: '2' }, { satz: 'Der Tisch im Laden, hinter dem die Verkäuferin steht.', wort: ['Theke'], zeilen: '3' },
      { satz: 'Viele Menschen, die hintereinander warten.', wort: ['Schlange'], zeilen: '4' }, { satz: 'Der Raum, in dem das Brot gebacken wird.', wort: ['Backstube'], zeilen: '4' },
      { satz: 'Er sagte etwas leise und undeutlich.', wort: ['murmelte'], zeilen: '6' }
    ],
    aussagen: [
      { s: 'Sara arbeitet in den Ferien in einer Bäckerei.', a: 'r', why: 'Absatz 1: Ferienaushilfe.' }, { s: 'Die Schürze passt Sara genau.', a: 'f', why: 'Absatz 1: viel zu gross.' },
      { s: 'Herr Ammann kauft jeden Tag Brot und Nussgipfel.', a: 'r', why: 'Absatz 2.' }, { s: 'Alle Kundinnen und Kunden lachen über die Witze von Herrn Ammann.', a: 'f', why: 'Absatz 2: Nur er selbst lacht.' },
      { s: 'Sara findet die Bestellung des Mannes im Bestellbuch.', a: 'f', why: 'Absatz 3: Dort steht nichts.' }, { s: 'Der Mann hat die Sandwiches wirklich bestellt.', a: 'k', why: 'Er behauptet es, aber der Text klärt nicht, ob es stimmt.' },
      { s: 'Frau Gerber hilft Sara an der Theke mit dem Mann.', a: 'f', why: 'Absatz 4: Sie steht in der Backstube.' }, { s: 'Sara gibt dem Mann sofort alle zehn Sandwiches.', a: 'f', why: 'Absatz 5: sechs sofort, vier später.' },
      { s: 'Der Mann arbeitet im zweiten Stock des Hauses gegenüber.', a: 'r', why: 'Absatz 5 und 6.' }, { s: 'Frau Gerber sieht durch ein Fenster, was passiert.', a: 'r', why: 'Absatz 7.' },
      { s: 'Sara verdient 15 Franken pro Stunde.', a: 'k', why: 'Zum Lohn steht nichts im Text.' }, { s: 'Frau Gerber schickt Sara am Ende nach Hause.', a: 'f', why: 'Absatz 7: Morgen schreibt Sara die Bestellungen ins Buch.' },
      { s: 'Die Bäckerei liegt in Zürich.', a: 'k', why: 'Der Ort wird nicht genannt.' }
    ],
    fragen: [
      { q: 'Wie reagiert Sara auf den lauten Mann? Nenne zwei Dinge, die sie tut.', model: 'Sie atmet tief durch und bleibt ruhig. Sie gibt ihm sofort sechs Sandwiches, macht vier frisch und bringt sie ihm ins Büro.', check: ['Ich nenne, dass sie ruhig bleibt.', 'Ich nenne ihre Lösung (sechs sofort, vier frisch, ins Büro bringen).'] },
      { q: 'Warum weiss der Mann zuerst nicht, was er sagen soll?', model: 'Er hat mit Streit gerechnet. Weil Sara freundlich bleibt und eine Lösung anbietet, hat seine Wut kein Ziel mehr.', check: ['Ich nenne, dass er mit Streit gerechnet hat.', 'Ich erkläre, dass Saras ruhige Lösung ihm den Grund für seine Wut nimmt.'] },
      { q: 'Erkläre den Satz von Frau Gerber: «Der Kunde hat nicht immer recht, aber er hat immer Hunger.» Wie passt er zur Geschichte?', skill: 'D19', model: 'Auch wenn sich ein Kunde irrt, soll er bekommen, was er braucht. Sara handelt genau so: Die Bestellung fehlt, trotzdem sorgt sie dafür, dass der Mann seine Sandwiches bekommt.', check: ['Ich erkläre die Bedeutung des Satzes.', 'Ich zeige, wie Sara danach handelt.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Mit Ruhe und einer guten Idee lässt sich ein Streit oft vermeiden.', 'Kundinnen und Kunden haben immer recht.', 'In einer Bäckerei muss man früh aufstehen.', 'Ferienjobs sind nur etwas für Erwachsene.'], a: 0, why: 'Sara bleibt ruhig und findet eine Lösung, der Streit bleibt aus.' },
      { q: 'Warum weiss Sara am Schluss nicht, ob es eine Belohnung oder eine Strafe ist?', o: ['Die neue Aufgabe zeigt Vertrauen, bringt aber auch mehr Verantwortung.', 'Frau Gerber ist wütend auf sie.', 'Sara hat die Bestellung verloren.', 'Sara will nicht mehr in der Bäckerei arbeiten.'], a: 0, why: 'Wer die Bestellungen ins Buch schreibt, ist verantwortlich, dass so etwas nicht mehr passiert.' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Der erste Arbeitstag', 'Der Witz von Herrn Ammann', 'Ein Tag ohne Kunden', 'Die zu kleine Schürze'], a: 0, why: 'Die Geschichte erzählt Saras ersten Tag als Ferienaushilfe.' }
    ]
  },
  {
    id: 'text-referat', title: 'Das Referat', kind: 'Erzählung',
    text: [
      'Jonas hatte drei Wochen lang an seinem Referat über Bienen gearbeitet. Er hatte Bücher aus der Bibliothek ausgeliehen, einen Imker in seinem Dorf besucht und am Abend vor dem Spiegel geübt, bis seine kleine Schwester die Sätze auswendig konnte. Trotzdem schlief er in der Nacht vor dem Vortrag kaum.',
      'Am Morgen zitterten seine Hände, als er den Laptop an den Beamer anschloss. Der Bildschirm blieb schwarz. Frau Keller, die Klassenlehrerin, drückte auf ein paar Tasten und runzelte die Stirn. «Das Kabel ist defekt», sagte sie. «Kannst du ohne Bilder anfangen?»',
      'Jonas nickte, obwohl er am liebsten im Boden versunken wäre. Ohne Bilder war sein Vortrag nur die Hälfte wert, dachte er. Er griff nach seinen Notizkarten. Die oberste Karte rutschte ihm aus der Hand und segelte unter die erste Bankreihe.',
      'Einige lachten. Elif, die in der ersten Reihe sass, hob die Karte auf und gab sie ihm, ohne etwas zu sagen. Dann zeigte sie mit dem Daumen nach oben. Jonas atmete tief durch. Er legte die Karten zur Seite und begann einfach zu erzählen: vom Imker, der ohne Handschuhe arbeitet, von den Wächterinnen am Eingang des Stocks und vom Tanz, mit dem eine Biene den anderen zeigt, wo die Blüten sind.',
      'Bei diesem Teil stand er auf, machte ein paar Schritte und wackelte mit den Hüften, so wie es der Imker ihm gezeigt hatte. Diesmal lachte die Klasse nicht über ihn, sondern mit ihm. Sogar Frau Keller schmunzelte.',
      'Nach zwölf Minuten war er fertig. Es gab viele Fragen, mehr als bei jedem anderen Referat in diesem Semester. Ein Junge aus der hintersten Reihe wollte wissen, ob Bienen schlafen. Jonas wusste es nicht. «Das finde ich heraus», versprach er.',
      'In der Pause kam Elif zu ihm. «Ohne Bilder war es besser», sagte sie. Jonas wollte widersprechen, doch dann musste er lachen. Am Nachmittag ging er noch einmal zum Imker. Er hatte eine Frage, auf die er eine Antwort schuldete.'
    ],
    figur: { name: 'Jonas', o: ['fleissig', 'nervös', 'ehrlich', 'zuverlässig', 'faul', 'gleichgültig', 'eingebildet', 'unhöflich', 'schadenfroh', 'geizig', 'streitsüchtig', 'wehleidig'], a: [0, 1, 2, 3], why: 'fleissig: Bücher, Besuch beim Imker, Üben vor dem Spiegel (Absatz 1). nervös: Er schläft kaum, seine Hände zittern (Absätze 1 und 2). ehrlich: Er gibt zu, dass er die Antwort nicht weiss (Absatz 6). zuverlässig: Er hält sein Versprechen und geht zum Imker (Absätze 6 und 7).' },
    zuordnen: [
      { satz: 'Ein Mensch, der Bienen hält.', wort: ['Imker'], zeilen: '1' }, { satz: 'Ein Gerät, das Bilder vom Computer an die Wand wirft.', wort: ['Beamer'], zeilen: '2' },
      { satz: 'Sie zog die Haut über den Augen zusammen.', wort: ['runzelte'], zeilen: '2' }, { satz: 'Nicht in Ordnung, kaputt.', wort: ['defekt'], zeilen: '2' },
      { satz: 'Sie lächelte ein wenig.', wort: ['schmunzelte'], zeilen: '5' }, { satz: 'Eine Hälfte eines Schuljahres.', wort: ['Semester'], zeilen: '6' },
      { satz: 'Etwas anderes sagen, weil man nicht einverstanden ist.', wort: ['widersprechen'], zeilen: '7' }
    ],
    aussagen: [
      { s: 'Jonas hat sich lange auf das Referat vorbereitet.', a: 'r', why: 'Absatz 1: drei Wochen.' }, { s: 'Jonas\' kleine Schwester kennt Sätze aus dem Referat auswendig.', a: 'r', why: 'Absatz 1.' },
      { s: 'Der Beamer funktioniert nicht, weil das Kabel defekt ist.', a: 'r', why: 'Absatz 2.' }, { s: 'Frau Keller verlangt, dass Jonas das Referat verschiebt.', a: 'f', why: 'Absatz 2: Sie fragt, ob er ohne Bilder anfangen kann.' },
      { s: 'Elif lacht Jonas aus, als die Karte herunterfällt.', a: 'f', why: 'Absatz 4: Sie hebt die Karte auf und zeigt den Daumen nach oben.' }, { s: 'Jonas hält das Referat am Schluss ohne seine Notizkarten.', a: 'r', why: 'Absatz 4: Er legt die Karten zur Seite.' },
      { s: 'Bienen zeigen einander mit einem Tanz, wo Blüten sind.', a: 'r', why: 'Absatz 4.' }, { s: 'Der Imker trägt bei der Arbeit immer Handschuhe.', a: 'f', why: 'Absatz 4: Er arbeitet ohne Handschuhe.' },
      { s: 'Das Referat dauert länger als eine Viertelstunde.', a: 'f', why: 'Absatz 6: zwölf Minuten.' }, { s: 'Jonas bekommt für sein Referat die Note 6.', a: 'k', why: 'Eine Note wird nicht erwähnt.' },
      { s: 'Jonas weiss, ob Bienen schlafen.', a: 'f', why: 'Absatz 6: Er wusste es nicht.' }, { s: 'Elif ist Jonas\' beste Freundin.', a: 'k', why: 'Der Text sagt nicht, wie gut sie befreundet sind.' },
      { s: 'Am Nachmittag besucht Jonas den Imker noch einmal.', a: 'r', why: 'Absatz 7.' }
    ],
    fragen: [
      { q: 'Warum lacht die Klasse in Absatz 5 anders als in Absatz 4?', model: 'In Absatz 4 lachen einige über Jonas, weil ihm die Karte herunterfällt. In Absatz 5 lacht die Klasse mit ihm, weil er den Bienentanz vorführt und alle begeistert.', check: ['Ich erkläre das Lachen in Absatz 4 (über ihn, Missgeschick).', 'Ich erkläre das Lachen in Absatz 5 (mit ihm, Bienentanz).'] },
      { q: 'Was macht Jonas, als die Technik nicht funktioniert? Nenne 2 Dinge.', model: 'Er legt die Notizkarten weg und erzählt frei. Beim Bienentanz macht er die Bewegungen selbst vor.', check: ['Ich nenne: Er erzählt frei ohne Karten.', 'Ich nenne: Er zeigt den Bienentanz selbst.'] },
      { q: 'Erkläre den letzten Satz: «Er hatte eine Frage, auf die er eine Antwort schuldete.»', skill: 'D19', model: 'Jonas hat versprochen herauszufinden, ob Bienen schlafen. Er hält sein Versprechen und fragt den Imker.', check: ['Ich nenne die Frage (ob Bienen schlafen) und das Versprechen.', 'Ich erkläre, dass Jonas zuverlässig ist.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Wer sein Thema gut kennt, kann auch eine Panne meistern.', 'Ohne Technik kann man kein gutes Referat halten.', 'Lehrerinnen sollten Kabel vorher prüfen.', 'Bienen sind die wichtigsten Tiere der Welt.'], a: 0, why: 'Jonas überzeugt auch ohne Bilder und Karten.' },
      { q: 'Was meint Elif mit «Ohne Bilder war es besser»?', o: ['Gerade weil Jonas frei erzählte, war das Referat lebendig.', 'Elif mag keine Bilder.', 'Elif will Jonas ärgern.', 'Die Bilder von Jonas waren schlecht.'], a: 0, why: 'Der freie Vortrag mit dem Bienentanz hat die Klasse begeistert (Absatz 5).' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Der Bienentanz', 'Das kaputte Handy', 'Streit in der Pause', 'Die vergessene Hausaufgabe'], a: 0, why: 'Der Bienentanz ist der Höhepunkt des Referats.' }
    ]
  },
  {
    id: 'text-oma', title: 'Zettel am Kühlschrank', kind: 'Erzählung',
    text: [
      'Als Mama beim Abendessen sagte, dass Oma zu ihnen ziehen werde, legte Lia die Gabel hin. «Und wo soll sie schlafen?», fragte sie, obwohl sie die Antwort schon ahnte. Die Wohnung hatte drei Zimmer, und eines davon war ihres.',
      'Zwei Wochen später stand ein zweites Bett in Lias Zimmer. Auf dem Fensterbrett, wo vorher ihre Pflanzen gestanden hatten, lagen jetzt Omas Brille, ein Stapel Kreuzworträtsel und eine Dose mit Pfefferminzbonbons. Lia redete kaum noch. Wenn Oma etwas fragte, antwortete sie mit einem Wort, manchmal auch nur mit einem Schulterzucken.',
      'Oma beklagte sich nie. Jeden Morgen stand sie vor allen anderen auf, damit Lia das Zimmer für sich hatte, wenn sie sich anzog. Und jeden Morgen klebte ein Zettel am Kühlschrank: «Viel Glück bei der Mathe-Prüfung!» oder «Heute gibt es Rösti, extra knusprig.» Lia las die Zettel und warf sie in den Abfall.',
      'An einem Donnerstag kam Lia früher nach Hause. Oma sass am Küchentisch über einem Brief und weinte leise. Als sie Lia bemerkte, schob sie den Brief schnell unter die Zeitung und lächelte. «Na, wie war die Schule?» Lia murmelte etwas und ging in ihr Zimmer. Aber sie konnte sich auf keine Hausaufgabe konzentrieren.',
      'Am Abend fragte sie Mama nach dem Brief. Mama seufzte. Er kam von der Verwaltung des Altersheims, in dem Opa zuletzt gewohnt hatte. Oma solle die letzten Sachen abholen. «Sie hat ihr ganzes Leben in ein paar Kisten packen müssen», sagte Mama. «Und jetzt hat sie nicht einmal ein eigenes Zimmer.»',
      'In dieser Nacht lag Lia lange wach. Sie hörte Oma atmen, ruhig und gleichmässig, nur einen Meter entfernt. Lia dachte an ihre Pflanzen, die jetzt im Wohnzimmer standen, und an die vielen Zettel im Abfall.',
      'Am nächsten Morgen stand Lia vor allen anderen auf. Als Oma in die Küche kam, klebte ein Zettel am Kühlschrank. Darauf stand in Lias schiefer Schrift: «Heute hole ich mit dir Opas Sachen. Um vier, nach der Schule.» Oma las ihn zweimal. Dann steckte sie den Zettel in ihre Jackentasche, nicht in den Abfall.'
    ],
    figur: { name: 'Lia', o: ['abweisend', 'nachdenklich', 'einfühlsam', 'hilfsbereit', 'schadenfroh', 'faul', 'prahlerisch', 'geizig', 'vorlaut', 'abergläubisch', 'eitel', 'verlogen'], a: [0, 1, 2, 3], why: 'abweisend: Sie antwortet mit einem Wort oder einem Schulterzucken und wirft die Zettel weg (Absätze 2 und 3). nachdenklich: Sie liegt lange wach und denkt nach (Absatz 6). einfühlsam: Sie versteht, was Oma verloren hat (Absätze 5 bis 7). hilfsbereit: Sie bietet an, mit Oma die Sachen zu holen (Absatz 7).' },
    zuordnen: [
      { satz: 'Sie wusste es schon ein bisschen, bevor man es ihr sagte.', wort: ['ahnte'], zeilen: '1' }, { satz: 'Der schmale Platz unten am Fenster.', wort: ['Fensterbrett'], zeilen: '2' },
      { satz: 'Sie sagte, dass ihr etwas nicht passt.', wort: ['beklagte'], zeilen: '3' }, { satz: 'Sie sprach leise und undeutlich.', wort: ['murmelte'], zeilen: '4' },
      { satz: 'Sie atmete hörbar aus, weil etwas schwer ist.', wort: ['seufzte'], zeilen: '5' }, { satz: 'Die Stelle, die ein Heim leitet und Briefe schreibt.', wort: ['Verwaltung'], zeilen: '5' },
      { satz: 'Immer im gleichen Takt.', wort: ['gleichmässig'], zeilen: '6' }
    ],
    aussagen: [
      { s: 'Die Wohnung hat drei Zimmer.', a: 'r', why: 'Absatz 1.' }, { s: 'Lia muss ihr Zimmer mit Oma teilen.', a: 'r', why: 'Absatz 2: ein zweites Bett in Lias Zimmer.' },
      { s: 'Oma steht morgens als Letzte auf.', a: 'f', why: 'Absatz 3: vor allen anderen.' }, { s: 'Oma schreibt jeden Morgen einen Zettel.', a: 'r', why: 'Absatz 3.' },
      { s: 'Lia bewahrt Omas Zettel in einer Schachtel auf.', a: 'f', why: 'Absatz 3: Sie wirft sie in den Abfall.' }, { s: 'Oma versteckt den Brief, als Lia hereinkommt.', a: 'r', why: 'Absatz 4: unter der Zeitung.' },
      { s: 'Der Brief kommt von der Schule.', a: 'f', why: 'Absatz 5: von der Verwaltung des Altersheims.' }, { s: 'Opa hat zuletzt in einem Altersheim gewohnt.', a: 'r', why: 'Absatz 5.' },
      { s: 'Lia hat einen älteren Bruder.', a: 'k', why: 'Geschwister werden nicht erwähnt.' }, { s: 'Lia hat die Mathe-Prüfung bestanden.', a: 'k', why: 'Der Zettel wünscht nur Glück. Das Ergebnis steht nicht im Text.' },
      { s: 'Lia schläft in der Nacht nach dem Gespräch sofort ein.', a: 'f', why: 'Absatz 6: Sie liegt lange wach.' }, { s: 'Lias Pflanzen stehen jetzt im Wohnzimmer.', a: 'r', why: 'Absatz 6.' },
      { s: 'Oma wirft Lias Zettel in den Abfall.', a: 'f', why: 'Absatz 7: Sie steckt ihn in die Jackentasche.' }
    ],
    fragen: [
      { q: 'Warum kann sich Lia am Donnerstag auf keine Hausaufgabe konzentrieren?', model: 'Sie hat Oma über einem Brief weinen sehen. Das beschäftigt sie, auch wenn sie es nicht zeigt.', check: ['Ich nenne, was Lia gesehen hat (Oma weint über einem Brief).', 'Ich erkläre, dass es sie beschäftigt.'] },
      { q: 'Wie zeigt der Text, dass sich Lias Verhalten gegenüber Oma ändert? Nenne je 1 Stelle vom Anfang und vom Schluss.', model: 'Am Anfang antwortet sie nur mit einem Wort und wirft die Zettel weg. Am Schluss steht sie früh auf und schreibt selbst einen Zettel, mit dem sie Hilfe anbietet.', check: ['Ich nenne eine Stelle vom Anfang (kurz angebunden, Zettel im Abfall).', 'Ich nenne eine Stelle vom Schluss (früh aufgestanden, eigener Zettel).'] },
      { q: 'Warum steckt Oma den Zettel in die Jackentasche und nicht in den Abfall?', skill: 'D19', model: 'Der Zettel bedeutet ihr viel, darum bewahrt sie ihn auf. Das ist das Gegenteil davon, wie Lia mit Omas Zetteln umgegangen ist.', check: ['Ich erkläre, dass der Zettel Oma viel bedeutet.', 'Ich vergleiche mit Lias Umgang mit Omas Zetteln (Abfall).'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Wer versteht, was der andere verloren hat, kann ihm entgegenkommen.', 'Kinder sollten nie ihr Zimmer teilen müssen.', 'Grosseltern sollten im Altersheim wohnen.', 'Zettel sind die beste Art, miteinander zu reden.'], a: 0, why: 'Erst als Lia von Omas Verlust erfährt, ändert sie ihr Verhalten.' },
      { q: 'Welche Rolle spielen die Zettel am Kühlschrank?', o: ['Sie zeigen, wie sich die Beziehung zwischen Lia und Oma verändert.', 'Sie sind eine Einkaufsliste.', 'Sie zeigen, dass Oma vergesslich ist.', 'Sie erklären, wo Opa gewohnt hat.'], a: 0, why: 'Am Anfang landen Omas Zettel im Abfall, am Schluss schreibt Lia selbst einen.' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Nur einen Meter entfernt', 'Ferien bei Oma', 'Der verlorene Schlüssel', 'Die Mathe-Prüfung'], a: 0, why: 'Lia und Oma schlafen nah beieinander, sind sich aber lange fremd (Absatz 6).' }
    ]
  },
  {
    id: 'text-nebel', title: 'Nebel auf dem Grat', kind: 'Erzählung',
    text: [
      'Der Wetterbericht hatte Sonne versprochen. Doch als Mira und ihr Vater um zwei Uhr nachmittags den Grat erreichten, kroch von unten grauer Nebel herauf. Innerhalb von Minuten sah Mira nicht einmal mehr den nächsten Wegweiser.',
      '«Kein Problem», sagte ihr Vater und zog sein Handy aus der Tasche. «Die Karte ist gespeichert.» Doch der Bildschirm blieb dunkel. Der Akku war leer, weil er unterwegs so viele Fotos gemacht hatte. Er fluchte leise. Mira merkte, dass seine Stimme anders klang als sonst.',
      'Mira öffnete ihren Rucksack. Ganz unten, unter der Regenjacke, lag die Papierkarte, die ihr die Grossmutter vor der Wanderung in die Hand gedrückt hatte. «Man weiss nie», hatte sie gesagt, und Mira hatte die Augen verdreht. Jetzt faltete sie die Karte vorsichtig auf einem Felsen auseinander.',
      'Sie suchten den kleinen See, an dem sie vor einer Stunde vorbeigekommen waren. Von dort führte ein Weg zur Hütte hinunter. «Wir müssen zurück bis zum Steinmann», sagte Mira, «und dann links.» Ihr Vater nickte. Er schien froh, dass jemand anderer entschied.',
      'Sie gingen langsam. Mira zählte die rot-weissen Markierungen auf den Steinen laut mit, damit sie keine übersahen. Einmal rutschte ihr Vater auf einer nassen Platte aus. Mira hielt ihn am Ärmel fest, bis er wieder sicher stand.',
      'Nach einer Stunde tauchte das Dach der Hütte aus dem Nebel auf. Der Hüttenwart brachte zwei Tassen Tee und sagte, dass bei diesem Wetter schon manche Wanderer die Nacht im Freien verbracht hätten. Miras Vater schwieg lange. Dann sagte er: «Ohne dich wären wir noch da oben.»',
      'Am Abend rief Mira ihre Grossmutter vom Telefon der Hütte aus an. Sie erzählte vom Nebel, vom leeren Handy und vom See. Von der Papierkarte erzählte sie nichts. Die wollte sie ihr selbst zurückgeben, zusammen mit einem Dankeschön.'
    ],
    figur: { name: 'Mira', o: ['besonnen', 'verantwortungsvoll', 'entschlossen', 'dankbar', 'leichtsinnig', 'ängstlich', 'schadenfroh', 'faul', 'geschwätzig', 'launisch', 'eifersüchtig', 'gleichgültig'], a: [0, 1, 2, 3], why: 'besonnen: Sie bleibt ruhig, faltet die Karte auf und geht langsam (Absätze 3 und 5). verantwortungsvoll: Sie zählt die Markierungen und hält den Vater fest (Absatz 5). entschlossen: Sie sagt, wohin es geht (Absatz 4). dankbar: Sie will der Grossmutter die Karte mit einem Dankeschön zurückgeben (Absatz 7).' },
    zuordnen: [
      { satz: 'Ein schmaler, langer Bergrücken.', wort: ['Grat'], zeilen: '1' }, { satz: 'Ein Schild, das die Richtung zeigt.', wort: ['Wegweiser'], zeilen: '1' },
      { satz: 'Er sagte ein böses Wort.', wort: ['fluchte'], zeilen: '2' }, { satz: 'Ein Haufen aus aufgeschichteten Steinen, der den Weg zeigt.', wort: ['Steinmann'], zeilen: '4' },
      { satz: 'Farbige Zeichen, die einen Wanderweg kennzeichnen.', wort: ['Markierungen'], zeilen: '5' }, { satz: 'Die Person, die eine Berghütte führt.', wort: ['Hüttenwart'], zeilen: '6' }
    ],
    aussagen: [
      { s: 'Für den Tag war schönes Wetter angesagt.', a: 'r', why: 'Absatz 1: Der Wetterbericht hatte Sonne versprochen.' }, { s: 'Der Nebel kommt erst am Abend.', a: 'f', why: 'Absatz 1: um zwei Uhr nachmittags.' },
      { s: 'Das Handy des Vaters ist ins Wasser gefallen.', a: 'f', why: 'Absatz 2: Der Akku ist leer.' }, { s: 'Der Vater hat unterwegs viele Fotos gemacht.', a: 'r', why: 'Absatz 2.' },
      { s: 'Mira hat die Papierkarte selbst gekauft.', a: 'f', why: 'Absatz 3: Die Grossmutter hat sie ihr gegeben.' }, { s: 'Mira fand die Idee der Grossmutter zuerst unnötig.', a: 'r', why: 'Absatz 3: Sie verdrehte die Augen.' },
      { s: 'Vom kleinen See führt ein Weg zur Hütte.', a: 'r', why: 'Absatz 4.' }, { s: 'Der Vater ist froh, dass Mira entscheidet.', a: 'r', why: 'Absatz 4: Er schien froh, dass jemand anderer entschied.' },
      { s: 'Mira zählt die Markierungen laut mit.', a: 'r', why: 'Absatz 5.' }, { s: 'Mira und ihr Vater übernachten im Freien.', a: 'f', why: 'Absätze 6 und 7: Sie erreichen die Hütte.' },
      { s: 'Der Hüttenwart kennt Miras Vater schon lange.', a: 'k', why: 'Dazu steht nichts im Text.' }, { s: 'Mira erzählt der Grossmutter am Telefon von der Papierkarte.', a: 'f', why: 'Absatz 7: Von der Karte erzählt sie nichts.' },
      { s: 'In der Hütte gibt es keinen Strom.', a: 'k', why: 'Dazu steht nichts im Text.' }
    ],
    fragen: [
      { q: 'Woran merkt Mira, dass ihr Vater unsicher ist? Nenne 2 Hinweise aus dem Text.', model: 'Er flucht leise, und seine Stimme klingt anders als sonst (Absatz 2). Später ist er froh, dass jemand anderer entscheidet (Absatz 4).', check: ['Ich nenne einen Hinweis aus Absatz 2 (Fluchen, Stimme).', 'Ich nenne einen zweiten Hinweis (froh, dass jemand anderer entscheidet).'] },
      { q: 'Warum zählt Mira die Markierungen laut mit?', model: 'Damit sie im Nebel keine Markierung übersehen und auf dem Weg bleiben.', check: ['Ich nenne den Grund: keine Markierung übersehen, auf dem Weg bleiben.'] },
      { q: 'Warum erzählt Mira der Grossmutter am Telefon nichts von der Papierkarte?', skill: 'D19', model: 'Sie will ihr die Karte selbst zurückgeben und sich persönlich bedanken. Sie gibt damit zu, dass die Grossmutter recht hatte.', check: ['Ich nenne Miras Plan (Karte selbst zurückgeben, danken).', 'Ich erkläre, warum ihr das wichtig ist (die Grossmutter hatte recht).'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Gute Vorbereitung und ein kühler Kopf helfen, wenn etwas schiefgeht.', 'Wanderungen in den Bergen sind immer gefährlich.', 'Handys sind in den Bergen nutzlos.', 'Erwachsene wissen immer, was zu tun ist.'], a: 0, why: 'Die Papierkarte und Miras Ruhe bringen beide sicher zur Hütte.' },
      { q: 'Wozu dient der Satz der Grossmutter «Man weiss nie»?', o: ['Er bereitet vor, dass die Papierkarte später wichtig wird.', 'Er zeigt, dass die Grossmutter vergesslich ist.', 'Er erklärt, warum der Akku leer ist.', 'Er beschreibt das Wetter.'], a: 0, why: 'Was Mira zuerst unnötig fand, rettet später die Wanderung.' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Die Papierkarte', 'Der verlorene Hund', 'Sonne am Grat', 'Streit auf der Hütte'], a: 0, why: 'Die Karte ist der Schlüssel der Geschichte.' }
    ]
  },
  {
    id: 'text-kresse', title: 'Die Sache mit der Heizung', kind: 'Erzählung',
    text: [
      'Am Forschungstag der Schule sollte jede Klasse ihre Projekte zeigen. Ben hatte zwei Monate lang Kresse gezogen. Seine Frage klang einfach: Wächst Kresse schneller, wenn man ihr Musik vorspielt? Jeden Abend stellte er eine Schale neben den Lautsprecher in seinem Zimmer und eine zweite in den stillen Flur.',
      'Das Ergebnis war eindeutig. Die Kresse mit Musik war fast doppelt so hoch wie die andere. Ben machte Fotos, zeichnete Diagramme und schrieb einen Bericht mit dem Titel «Mozart macht Kresse gross». Seine Lehrerin, Frau Odermatt, fand den Titel grossartig.',
      'Zwei Tage vor dem Forschungstag lag Ben auf dem Boden seines Zimmers und suchte ein Ladekabel. Dabei fiel ihm etwas auf. Neben dem Lautsprecher stand die Heizung. Im Flur dagegen war es kühl. Ben setzte sich auf. War die Kresse wegen der Musik so gut gewachsen oder wegen der Wärme?',
      'Er sprach mit niemandem darüber. In der Nacht konnte er kaum schlafen. Wenn er nichts sagte, würde niemand den Fehler bemerken. Die Plakate waren gedruckt, die Fotos waren schön, und sein Bruder hatte ihm schon gratuliert.',
      'Am Morgen des Forschungstags stand Ben vor seinem Plakat, als die Jury kam: zwei Lehrer und eine Forscherin der Universität. Ben räusperte sich. «Mein Ergebnis ist vielleicht falsch», sagte er. Dann erklärte er die Sache mit der Heizung. Die Forscherin hob die Augenbrauen.',
      '«Und was würdest du jetzt anders machen?», fragte sie. Ben dachte kurz nach. «Beide Schalen in denselben Raum stellen. Gleich warm, gleich hell. Nur die Musik ändern.» Die Forscherin nickte langsam und schrieb etwas auf ihren Block.',
      'Ben gewann keinen Preis. Aber eine Woche später kam ein Brief von der Universität. Die Forscherin lud ihn und seine Klasse in ihr Labor ein. «Fehler finden ist die halbe Wissenschaft», stand am Schluss. Ben hängte den Brief neben sein Plakat. Den Titel hatte er inzwischen mit einem Fragezeichen ergänzt.'
    ],
    figur: { name: 'Ben', o: ['ehrlich', 'fleissig', 'aufmerksam', 'selbstkritisch', 'eingebildet', 'faul', 'unhöflich', 'neidisch', 'leichtsinnig', 'schadenfroh', 'verlogen', 'geizig'], a: [0, 1, 2, 3], why: 'ehrlich: Er sagt der Jury, dass sein Ergebnis falsch sein könnte (Absatz 5). fleissig: zwei Monate Kresse, Fotos, Diagramme, Bericht (Absätze 1 und 2). aufmerksam: Er bemerkt die Heizung neben dem Lautsprecher (Absatz 3). selbstkritisch: Er prüft sein eigenes Ergebnis und ergänzt den Titel mit einem Fragezeichen (Absätze 3 und 7).' },
    zuordnen: [
      { satz: 'Eine kleine Pflanze, die man aufs Brot streut.', wort: ['Kresse'], zeilen: '1' }, { satz: 'Bilder mit Linien oder Balken, die Zahlen zeigen.', wort: ['Diagramme'], zeilen: '2' },
      { satz: 'Ein Gerät, das Wärme abgibt.', wort: ['Heizung'], zeilen: '3' }, { satz: 'Eine Gruppe, die Arbeiten bewertet.', wort: ['Jury'], zeilen: '5' },
      { satz: 'Er hustete leise, bevor er zu sprechen begann.', wort: ['räusperte'], zeilen: '5' }, { satz: 'Ein Raum, in dem Forschende Versuche machen.', wort: ['Labor'], zeilen: '7' },
      { satz: 'Er fügte etwas hinzu.', wort: ['ergänzt'], zeilen: '7' }
    ],
    aussagen: [
      { s: 'Ben hat zwei Schalen mit Kresse gezogen.', a: 'r', why: 'Absatz 1.' }, { s: 'Beide Schalen standen im gleichen Raum.', a: 'f', why: 'Absatz 1: eine im Zimmer, eine im Flur.' },
      { s: 'Die Kresse mit Musik wuchs weniger hoch.', a: 'f', why: 'Absatz 2: fast doppelt so hoch.' }, { s: 'Frau Odermatt gefällt Bens Titel.', a: 'r', why: 'Absatz 2: Sie fand ihn grossartig.' },
      { s: 'Ben entdeckt die Heizung, als er ein Ladekabel sucht.', a: 'r', why: 'Absatz 3.' }, { s: 'Ben erzählt seinem Bruder sofort von seinem Fehler.', a: 'f', why: 'Absatz 4: Er sprach mit niemandem darüber.' },
      { s: 'In der Jury sitzt eine Forscherin der Universität.', a: 'r', why: 'Absatz 5.' }, { s: 'Ben gewinnt den ersten Preis.', a: 'f', why: 'Absatz 7: Er gewann keinen Preis.' },
      { s: 'Die Forscherin lädt Bens Klasse in ihr Labor ein.', a: 'r', why: 'Absatz 7.' }, { s: 'Ben hört am liebsten Musik von Mozart.', a: 'k', why: 'Der Text nennt Mozart nur im Titel des Berichts.' },
      { s: 'Bens Bruder hat die Plakate gedruckt.', a: 'k', why: 'Der Text sagt nicht, wer die Plakate gedruckt hat.' }, { s: 'Ben ändert den Titel seines Plakats.', a: 'r', why: 'Absatz 7: mit einem Fragezeichen ergänzt.' },
      { s: 'Der Forschungstag findet an einem Samstag statt.', a: 'k', why: 'Der Wochentag wird nicht genannt.' }
    ],
    fragen: [
      { q: 'Warum kann Ben in der Nacht vor dem Forschungstag kaum schlafen?', model: 'Er weiss, dass sein Ergebnis wegen der Heizung falsch sein könnte. Er überlegt, ob er schweigen oder den Fehler zugeben soll.', check: ['Ich nenne den Fehler (Wärme der Heizung statt Musik).', 'Ich nenne Bens Zwiespalt (schweigen oder zugeben).'] },
      { q: 'Was würde Ben bei einem neuen Versuch anders machen?', model: 'Er würde beide Schalen in denselben Raum stellen, gleich warm und gleich hell, und nur die Musik ändern.', check: ['Ich nenne: gleicher Raum, gleiche Wärme und gleiches Licht.', 'Ich nenne: Nur die Musik ist verschieden.'] },
      { q: 'Erkläre, warum Ben den Titel mit einem Fragezeichen ergänzt.', skill: 'D19', model: 'Mit dem Fragezeichen zeigt Ben, dass seine Behauptung nicht bewiesen ist. Er steht zu seinem Fehler.', check: ['Ich erkläre, dass der Titel jetzt eine offene Frage ist.', 'Ich verbinde das mit Bens Ehrlichkeit.'] }
    ],
    mc: [
      { q: 'Welcher Satz trifft die Kernaussage des Textes am besten?', o: ['Einen Fehler offen zuzugeben, kann mehr wert sein als ein Preis.', 'Musik lässt Pflanzen schneller wachsen.', 'Wettbewerbe sind immer ungerecht.', 'Man sollte keine Experimente machen.'], a: 0, why: 'Ben verliert den Preis, gewinnt aber die Einladung ins Labor.' },
      { q: 'Was meint die Forscherin mit «Fehler finden ist die halbe Wissenschaft»?', o: ['Wer Fehler entdeckt und daraus lernt, arbeitet wie ein Forscher.', 'In der Wissenschaft macht man nur Fehler.', 'Ben hat die Hälfte seiner Arbeit falsch gemacht.', 'Fehler sind in der Schule verboten.'], a: 0, why: 'Ben hat seinen Versuch selbst kritisch geprüft und verbessert (Absatz 6).' },
      { q: 'Welcher Titel passt ebenfalls zum Text?', o: ['Mozart macht Kresse gross?', 'Der verlorene Preis', 'Musik im Flur', 'Bens neuer Lautsprecher'], a: 0, why: 'So heisst Bens Titel am Schluss, mit Fragezeichen.' }
    ]
  }
]);
