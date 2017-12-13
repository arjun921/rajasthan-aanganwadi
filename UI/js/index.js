var start,end;
var paginateSplit = 50;
var da = {
    "title": "Home",
    "id": "_ROOT_",
    "contains": [{"id":1,"title":"Vulputate.tiff"},
{"id":2,"title":"SemperPortaVolutpat.mpeg"},
{"id":3,"title":"SitAmet.avi"},
{"id":4,"title":"VestibulumAnte.tiff"},
{"id":5,"title":"NecCondimentum.ppt"},
{"id":6,"title":"MaurisNonLigula.avi"},
{"id":7,"title":"Egestas.mov"},
{"id":8,"title":"Maecenas.mpeg"},
{"id":9,"title":"VolutpatQuamPede.png"},
{"id":10,"title":"Ut.xls"},
{"id":11,"title":"AliquamQuis.ppt"},
{"id":12,"title":"NecMolestieSed.mov"},
{"id":13,"title":"Varius.txt"},
{"id":14,"title":"Mattis.mp3"},
{"id":15,"title":"HacHabitassePlatea.mp3"},
{"id":16,"title":"MetusArcu.mov"},
{"id":17,"title":"VivamusMetus.mpeg"},
{"id":18,"title":"ViverraDapibusNulla.mp3"},
{"id":19,"title":"CondimentumId.tiff"},
{"id":20,"title":"RidiculusMus.avi"},
{"id":21,"title":"AugueVestibulum.avi"},
{"id":22,"title":"FelisUt.mp3"},
{"id":23,"title":"Rutrum.jpeg"},
{"id":24,"title":"Nam.mp3"},
{"id":25,"title":"RidiculusMusVivamus.avi"},
{"id":26,"title":"VolutpatInCongue.tiff"},
{"id":27,"title":"Aliquam.ppt"},
{"id":28,"title":"IdLobortisConvallis.tiff"},
{"id":29,"title":"ElementumPellentesqueQuisque.txt"},
{"id":30,"title":"TurpisIntegerAliquet.mp3"},
{"id":31,"title":"SapienVarius.gif"},
{"id":32,"title":"UltricesPosuere.avi"},
{"id":33,"title":"AnteIpsum.tiff"},
{"id":34,"title":"VenenatisLaciniaAenean.mp3"},
{"id":35,"title":"UltricesMattisOdio.ppt"},
{"id":36,"title":"TempusSitAmet.ppt"},
{"id":37,"title":"IpsumPrimisIn.xls"},
{"id":38,"title":"NislNunc.ppt"},
{"id":39,"title":"ElementumIn.avi"},
{"id":40,"title":"InHacHabitasse.mp3"},
{"id":41,"title":"OrnareImperdietSapien.ppt"},
{"id":42,"title":"Consequat.mp3"},
{"id":43,"title":"CurabiturConvallisDuis.mp3"},
{"id":44,"title":"Urna.avi"},
{"id":45,"title":"QuisqueUtErat.tiff"},
{"id":46,"title":"Phasellus.avi"},
{"id":47,"title":"Ante.png"},
{"id":48,"title":"TellusIn.ppt"},
{"id":49,"title":"HabitassePlateaDictumst.avi"},
{"id":50,"title":"CongueEgetSemper.xls"},
{"id":51,"title":"MorbiQuisTortor.xls"},
{"id":52,"title":"VivamusMetusArcu.ppt"},
{"id":53,"title":"NuncViverra.ppt"},
{"id":54,"title":"Purus.txt"},
{"id":55,"title":"UtMassaVolutpat.avi"},
{"id":56,"title":"Adipiscing.ppt"},
{"id":57,"title":"MassaVolutpat.avi"},
{"id":58,"title":"PlateaDictumstAliquam.mp3"},
{"id":59,"title":"OrciEgetOrci.ppt"},
{"id":60,"title":"UrnaPretiumNisl.ppt"},
{"id":61,"title":"AliquamErat.avi"},
{"id":62,"title":"Ridiculus.png"},
{"id":63,"title":"SuspendissePotentiCras.avi"},
{"id":64,"title":"UltricesPhasellusId.xls"},
{"id":65,"title":"Turpis.xls"},
{"id":66,"title":"FelisSedInterdum.mp3"},
{"id":67,"title":"RutrumRutrumNeque.gif"},
{"id":68,"title":"JustoMorbiUt.avi"},
{"id":69,"title":"FeugiatNonPretium.avi"},
{"id":70,"title":"SemPraesentId.xls"},
{"id":71,"title":"NullaNeque.avi"},
{"id":72,"title":"NullaSed.xls"},
{"id":73,"title":"Justo.mpeg"},
{"id":74,"title":"SedNislNunc.pdf"},
{"id":75,"title":"Cum.avi"},
{"id":76,"title":"Nascetur.avi"},
{"id":77,"title":"LigulaSuspendisse.xls"},
{"id":78,"title":"NullaMollisMolestie.xls"},
{"id":79,"title":"Ut.png"},
{"id":80,"title":"LectusIn.ppt"},
{"id":81,"title":"Etiam.png"},
{"id":82,"title":"EgetRutrum.pdf"},
{"id":83,"title":"MetusAeneanFermentum.xls"},
{"id":84,"title":"Amet.mp3"},
{"id":85,"title":"MattisOdioDonec.jpeg"},
{"id":86,"title":"OdioIn.ppt"},
{"id":87,"title":"Magna.ppt"},
{"id":88,"title":"LoremVitaeMattis.mp3"},
{"id":89,"title":"Porta.ppt"},
{"id":90,"title":"Elementum.mp3"},
{"id":91,"title":"PorttitorLacusAt.tiff"},
{"id":92,"title":"CongueDiamId.xls"},
{"id":93,"title":"Volutpat.xls"},
{"id":94,"title":"Viverra.gif"},
{"id":95,"title":"Porttitor.mp3"},
{"id":96,"title":"PosuereCubiliaCurae.jpeg"},
{"id":97,"title":"DiamEratFermentum.pdf"},
{"id":98,"title":"PraesentBlanditLacinia.ppt"},
{"id":99,"title":"PraesentBlanditLacinia.xls"},
{"id":100,"title":"Aliquet.avi"},
{"id":101,"title":"DolorVel.mp3"},
{"id":102,"title":"AeneanSit.ppt"},
{"id":103,"title":"PedeAcDiam.avi"},
{"id":104,"title":"Donec.txt"},
{"id":105,"title":"Et.mp3"},
{"id":106,"title":"ViverraDapibus.png"},
{"id":107,"title":"NonummyMaecenas.mp3"},
{"id":108,"title":"OrciPedeVenenatis.mov"},
{"id":109,"title":"ElementumEuInterdum.ppt"},
{"id":110,"title":"DapibusAt.mov"},
{"id":111,"title":"In.tiff"},
{"id":112,"title":"Convallis.mpeg"},
{"id":113,"title":"VestibulumSedMagna.mp3"},
{"id":114,"title":"EstQuam.png"},
{"id":115,"title":"Commodo.avi"},
{"id":116,"title":"QuisquePorta.jpeg"},
{"id":117,"title":"EuPede.ppt"},
{"id":118,"title":"TinciduntAnteVel.avi"},
{"id":119,"title":"Et.mp3"},
{"id":120,"title":"VitaeMattisNibh.doc"},
{"id":121,"title":"OrciLuctusEt.avi"},
{"id":122,"title":"Aliquam.mov"},
{"id":123,"title":"ElitAc.jpeg"},
{"id":124,"title":"Justo.xls"},
{"id":125,"title":"UtErat.gif"},
{"id":126,"title":"EgetEleifend.jpeg"},
{"id":127,"title":"MattisNibh.mp3"},
{"id":128,"title":"TurpisAdipiscingLorem.mov"},
{"id":129,"title":"Lacus.avi"},
{"id":130,"title":"Ac.png"},
{"id":131,"title":"MetusArcuAdipiscing.mp3"},
{"id":132,"title":"MassaTemporConvallis.mp3"},
{"id":133,"title":"SemperRutrum.jpeg"},
{"id":134,"title":"Felis.mp3"},
{"id":135,"title":"Duis.xls"},
{"id":136,"title":"Porttitor.avi"},
{"id":137,"title":"SitAmet.xls"},
{"id":138,"title":"DiamCrasPellentesque.tiff"},
{"id":139,"title":"Mus.xls"},
{"id":140,"title":"Blandit.avi"},
{"id":141,"title":"VulputateVitae.gif"},
{"id":142,"title":"ConsequatNullaNisl.mp3"},
{"id":143,"title":"PraesentIdMassa.mp3"},
{"id":144,"title":"Lacus.jpeg"},
{"id":145,"title":"AtTurpisA.doc"},
{"id":146,"title":"Velit.tiff"},
{"id":147,"title":"TristiqueInTempus.jpeg"},
{"id":148,"title":"LaciniaEget.jpeg"},
{"id":149,"title":"NullamOrciPede.ppt"},
{"id":150,"title":"Vitae.avi"},
{"id":151,"title":"In.xls"},
{"id":152,"title":"EuMagnaVulputate.ppt"},
{"id":153,"title":"Rutrum.avi"},
{"id":154,"title":"Malesuada.tiff"},
{"id":155,"title":"At.pdf"},
{"id":156,"title":"LeoRhoncusSed.ppt"},
{"id":157,"title":"MetusVitaeIpsum.png"},
{"id":158,"title":"UtEratId.avi"},
{"id":159,"title":"PedeLibero.xls"},
{"id":160,"title":"Rutrum.png"},
{"id":161,"title":"Mattis.gif"},
{"id":162,"title":"PrimisInFaucibus.tiff"},
{"id":163,"title":"UltricesLibero.avi"},
{"id":164,"title":"QuisqueUt.tiff"},
{"id":165,"title":"NislAeneanLectus.avi"},
{"id":166,"title":"Morbi.doc"},
{"id":167,"title":"DuisMattisEgestas.mp3"},
{"id":168,"title":"In.mp3"},
{"id":169,"title":"Sed.avi"},
{"id":170,"title":"Porttitor.txt"},
{"id":171,"title":"VestibulumSitAmet.jpeg"},
{"id":172,"title":"EgetCongueEget.jpeg"},
{"id":173,"title":"AtIpsumAc.avi"},
{"id":174,"title":"Enim.mp3"},
{"id":175,"title":"HacHabitassePlatea.txt"},
{"id":176,"title":"MorbiOdioOdio.ppt"},
{"id":177,"title":"EstEt.avi"},
{"id":178,"title":"JustoNec.avi"},
{"id":179,"title":"Iaculis.xls"},
{"id":180,"title":"Tortor.tiff"},
{"id":181,"title":"Vitae.mpeg"},
{"id":182,"title":"Eget.jpeg"},
{"id":183,"title":"SuspendisseOrnareConsequat.mp3"},
{"id":184,"title":"RutrumNulla.tiff"},
{"id":185,"title":"Sit.avi"},
{"id":186,"title":"OdioCrasMi.avi"},
{"id":187,"title":"AtLorem.avi"},
{"id":188,"title":"AliquamQuis.mp3"},
{"id":189,"title":"InFaucibus.ppt"},
{"id":190,"title":"MolestieLorem.png"},
{"id":191,"title":"Purus.avi"},
{"id":192,"title":"Duis.png"},
{"id":193,"title":"Augue.avi"},
{"id":194,"title":"InSagittis.ppt"},
{"id":195,"title":"LacusAt.mp3"},
{"id":196,"title":"Tellus.xls"},
{"id":197,"title":"BlanditNonInterdum.jpeg"},
{"id":198,"title":"PosuereNonummyInteger.mp3"},
{"id":199,"title":"Vestibulum.xls"},
{"id":200,"title":"Nisl.avi"},
{"id":201,"title":"InterdumMaurisNon.xls"},
{"id":202,"title":"Sed.jpeg"},
{"id":203,"title":"Orci.txt"},
{"id":204,"title":"QuamSuspendisse.ppt"},
{"id":205,"title":"MaurisNonLigula.png"},
{"id":206,"title":"MorbiQuis.xls"},
{"id":207,"title":"Proin.xls"},
{"id":208,"title":"SuscipitAFeugiat.mpeg"},
{"id":209,"title":"EstQuamPharetra.mpeg"},
{"id":210,"title":"InBlanditUltrices.mpeg"},
{"id":211,"title":"Massa.ppt"},
{"id":212,"title":"Sit.xls"},
{"id":213,"title":"NullamMolestie.ppt"},
{"id":214,"title":"LigulaPellentesque.jpeg"},
{"id":215,"title":"ProinRisusPraesent.xls"},
{"id":216,"title":"Sem.mp3"},
{"id":217,"title":"PellentesqueEgetNunc.tiff"},
{"id":218,"title":"AFeugiat.xls"},
{"id":219,"title":"Eget.mp3"},
{"id":220,"title":"MagnaBibendumImperdiet.txt"},
{"id":221,"title":"VestibulumAliquetUltrices.tiff"},
{"id":222,"title":"TristiqueFusce.png"},
{"id":223,"title":"AccumsanOdio.txt"},
{"id":224,"title":"LiberoConvallisEget.tiff"},
{"id":225,"title":"Sit.avi"},
{"id":226,"title":"SedJusto.tiff"},
{"id":227,"title":"MattisNibhLigula.jpeg"},
{"id":228,"title":"SedNisl.avi"},
{"id":229,"title":"QuisqueArcuLibero.ppt"},
{"id":230,"title":"Sed.jpeg"},
{"id":231,"title":"UltricesEnimLorem.avi"},
{"id":232,"title":"LeoOdioCondimentum.ppt"},
{"id":233,"title":"MontesNasceturRidiculus.ppt"},
{"id":234,"title":"Consectetuer.ppt"},
{"id":235,"title":"NuncViverraDapibus.avi"},
{"id":236,"title":"CurabiturConvallisDuis.mp3"},
{"id":237,"title":"MorbiPorttitorLorem.mov"},
{"id":238,"title":"Ut.tiff"},
{"id":239,"title":"Hac.avi"},
{"id":240,"title":"IpsumInteger.doc"},
{"id":241,"title":"Nulla.ppt"},
{"id":242,"title":"NislUtVolutpat.jpeg"},
{"id":243,"title":"Quis.txt"},
{"id":244,"title":"Convallis.tiff"},
{"id":245,"title":"DolorMorbi.xls"},
{"id":246,"title":"JustoMorbiUt.doc"},
{"id":247,"title":"Ipsum.ppt"},
{"id":248,"title":"Purus.xls"},
{"id":249,"title":"Nunc.jpeg"},
{"id":250,"title":"EratCurabiturGravida.xls"},
{"id":251,"title":"LeoRhoncusSed.mp3"},
{"id":252,"title":"MorbiSem.mov"},
{"id":253,"title":"EgetMassaTempor.ppt"},
{"id":254,"title":"EratFermentumJusto.tiff"},
{"id":255,"title":"AugueVestibulum.doc"},
{"id":256,"title":"NecNisi.xls"},
{"id":257,"title":"Platea.ppt"},
{"id":258,"title":"Turpis.xls"},
{"id":259,"title":"MattisEgestasMetus.tiff"},
{"id":260,"title":"JustoSit.mov"},
{"id":261,"title":"Eu.tiff"},
{"id":262,"title":"PedeUllamcorper.jpeg"},
{"id":263,"title":"RisusPraesentLectus.mpeg"},
{"id":264,"title":"Nunc.txt"},
{"id":265,"title":"Volutpat.doc"},
{"id":266,"title":"Amet.avi"},
{"id":267,"title":"Pellentesque.txt"},
{"id":268,"title":"PraesentBlandit.xls"},
{"id":269,"title":"CongueElementumIn.tiff"},
{"id":270,"title":"NislDuisBibendum.doc"},
{"id":271,"title":"AtDolorQuis.tiff"},
{"id":272,"title":"UtDolorMorbi.gif"},
{"id":273,"title":"AnteIpsumPrimis.tiff"},
{"id":274,"title":"SedLacusMorbi.xls"},
{"id":275,"title":"DiamVitae.tiff"},
{"id":276,"title":"RisusSemperPorta.ppt"},
{"id":277,"title":"Fusce.mp3"},
{"id":278,"title":"Luctus.ppt"},
{"id":279,"title":"Pede.mp3"},
{"id":280,"title":"EstQuamPharetra.txt"},
{"id":281,"title":"VestibulumEget.ppt"},
{"id":282,"title":"LacusMorbiQuis.avi"},
{"id":283,"title":"Aliquam.ppt"},
{"id":284,"title":"AliquamSit.mp3"},
{"id":285,"title":"IntegerAc.xls"},
{"id":286,"title":"ConsequatVariusInteger.gif"},
{"id":287,"title":"Eget.xls"},
{"id":288,"title":"RhoncusMaurisEnim.avi"},
{"id":289,"title":"Eu.tiff"},
{"id":290,"title":"Vel.avi"},
{"id":291,"title":"EstLacinia.avi"},
{"id":292,"title":"Suspendisse.xls"},
{"id":293,"title":"TurpisElementum.xls"},
{"id":294,"title":"Nulla.jpeg"},
{"id":295,"title":"UltricesPosuere.jpeg"},
{"id":296,"title":"Pede.tiff"},
{"id":297,"title":"Eleifend.pdf"},
{"id":298,"title":"Nulla.xls"},
{"id":299,"title":"Eu.avi"},
{"id":300,"title":"VariusUtBlandit.avi"},
{"id":301,"title":"Justo.mp3"},
{"id":302,"title":"AliquamSit.txt"},
{"id":303,"title":"EuMagna.mp3"},
{"id":304,"title":"Mauris.xls"},
{"id":305,"title":"InLectusPellentesque.mp3"},
{"id":306,"title":"RisusAuctor.xls"},
{"id":307,"title":"Quis.ppt"},
{"id":308,"title":"SapienInSapien.tiff"},
{"id":309,"title":"Sodales.ppt"},
{"id":310,"title":"Quisque.ppt"},
{"id":311,"title":"In.mp3"},
{"id":312,"title":"NonVelit.xls"},
{"id":313,"title":"Blandit.xls"},
{"id":314,"title":"PraesentBlandit.mp3"},
{"id":315,"title":"QuisLibero.mp3"},
{"id":316,"title":"JustoMaecenasRhoncus.avi"},
{"id":317,"title":"NuncProinAt.avi"},
{"id":318,"title":"Amet.mp3"},
{"id":319,"title":"LeoRhoncus.xls"},
{"id":320,"title":"Dui.mp3"},
{"id":321,"title":"Bibendum.xls"},
{"id":322,"title":"NuncNislDuis.mov"},
{"id":323,"title":"FelisEu.mov"},
{"id":324,"title":"Justo.tiff"},
{"id":325,"title":"TristiqueTortor.jpeg"},
{"id":326,"title":"MagnaAtNunc.xls"},
{"id":327,"title":"Vel.mp3"},
{"id":328,"title":"NisiAtNibh.tiff"},
{"id":329,"title":"NecMolestieSed.tiff"},
{"id":330,"title":"AnteVelIpsum.mp3"},
{"id":331,"title":"Morbi.mpeg"},
{"id":332,"title":"Laoreet.avi"},
{"id":333,"title":"AeneanAuctorGravida.avi"},
{"id":334,"title":"NonMauris.xls"},
{"id":335,"title":"Ultrices.gif"},
{"id":336,"title":"SapienPlacerat.ppt"},
{"id":337,"title":"DuiNecNisi.mp3"},
{"id":338,"title":"Pede.xls"},
{"id":339,"title":"TurpisElementumLigula.avi"},
{"id":340,"title":"Iaculis.avi"},
{"id":341,"title":"Id.tiff"},
{"id":342,"title":"FelisSed.avi"},
{"id":343,"title":"BlanditNonInterdum.jpeg"},
{"id":344,"title":"Sit.jpeg"},
{"id":345,"title":"DictumstMaecenas.avi"},
{"id":346,"title":"PedeVenenatisNon.tiff"},
{"id":347,"title":"UtSuscipitA.gif"},
{"id":348,"title":"TellusNulla.ppt"},
{"id":349,"title":"AmetEleifendPede.xls"},
{"id":350,"title":"Sed.mp3"},
{"id":351,"title":"VivamusIn.tiff"},
{"id":352,"title":"SedAnteVivamus.mp3"},
{"id":353,"title":"SuspendissePotenti.gif"},
{"id":354,"title":"PosuereCubilia.gif"},
{"id":355,"title":"AFeugiatEt.xls"},
{"id":356,"title":"UltricesMattis.doc"},
{"id":357,"title":"QuisLibero.jpeg"},
{"id":358,"title":"DuiNec.mp3"},
{"id":359,"title":"In.xls"},
{"id":360,"title":"A.avi"},
{"id":361,"title":"ErosSuspendisse.xls"},
{"id":362,"title":"PorttitorPede.mp3"},
{"id":363,"title":"ImperdietEtCommodo.tiff"},
{"id":364,"title":"TinciduntLacusAt.avi"},
{"id":365,"title":"InFaucibusOrci.pdf"},
{"id":366,"title":"NullaFacilisi.tiff"},
{"id":367,"title":"Sem.ppt"},
{"id":368,"title":"Ac.xls"},
{"id":369,"title":"SagittisSapienCum.txt"},
{"id":370,"title":"Et.doc"},
{"id":371,"title":"AliquamQuis.avi"},
{"id":372,"title":"NecCondimentum.xls"},
{"id":373,"title":"TemporTurpisNec.mpeg"},
{"id":374,"title":"AcDiam.ppt"},
{"id":375,"title":"VelDapibus.xls"},
{"id":376,"title":"AnteIpsumPrimis.xls"},
{"id":377,"title":"InterdumIn.avi"},
{"id":378,"title":"Sapien.jpeg"},
{"id":379,"title":"PellentesqueAt.mp3"},
{"id":380,"title":"FermentumDonec.mp3"},
{"id":381,"title":"NullaMollis.ppt"},
{"id":382,"title":"OdioDonecVitae.xls"},
{"id":383,"title":"NibhLigula.avi"},
{"id":384,"title":"SollicitudinVitae.xls"},
{"id":385,"title":"SemperPortaVolutpat.ppt"},
{"id":386,"title":"LigulaSitAmet.txt"},
{"id":387,"title":"DiamEratFermentum.xls"},
{"id":388,"title":"EuPede.doc"},
{"id":389,"title":"IdTurpis.ppt"},
{"id":390,"title":"VenenatisNonSodales.avi"},
{"id":391,"title":"Nulla.xls"},
{"id":392,"title":"Aliquet.avi"},
{"id":393,"title":"Condimentum.jpeg"},
{"id":394,"title":"InterdumMaurisNon.jpeg"},
{"id":395,"title":"Adipiscing.mov"},
{"id":396,"title":"CongueDiam.ppt"},
{"id":397,"title":"Cursus.mp3"},
{"id":398,"title":"DapibusDuisAt.avi"},
{"id":399,"title":"EtiamPretiumIaculis.mp3"},
{"id":400,"title":"IntegerANibh.ppt"},
{"id":401,"title":"VivamusMetus.ppt"},
{"id":402,"title":"AnteVestibulum.ppt"},
{"id":403,"title":"InFelis.xls"},
{"id":404,"title":"Vestibulum.pdf"},
{"id":405,"title":"DiamInMagna.jpeg"},
{"id":406,"title":"PenatibusEt.mp3"},
{"id":407,"title":"JustoMaecenas.xls"},
{"id":408,"title":"ArcuLibero.mp3"},
{"id":409,"title":"EgetNuncDonec.ppt"},
{"id":410,"title":"PellentesqueViverraPede.mp3"},
{"id":411,"title":"Massa.png"},
{"id":412,"title":"SitAmet.mp3"},
{"id":413,"title":"EuInterdumEu.gif"},
{"id":414,"title":"NibhQuisque.tiff"},
{"id":415,"title":"PosuereCubiliaCurae.ppt"},
{"id":416,"title":"Lacus.mp3"},
{"id":417,"title":"SapienInSapien.tiff"},
{"id":418,"title":"VelitVivamusVel.avi"},
{"id":419,"title":"Primis.mov"},
{"id":420,"title":"Lobortis.ppt"},
{"id":421,"title":"LeoOdioCondimentum.mpeg"},
{"id":422,"title":"AnteIpsumPrimis.avi"},
{"id":423,"title":"NullaAcEnim.xls"},
{"id":424,"title":"Pretium.xls"},
{"id":425,"title":"Lacinia.png"},
{"id":426,"title":"Tellus.xls"},
{"id":427,"title":"NecNisiVulputate.ppt"},
{"id":428,"title":"InterdumVenenatisTurpis.png"},
{"id":429,"title":"EuOrci.xls"},
{"id":430,"title":"Rutrum.tiff"},
{"id":431,"title":"Metus.tiff"},
{"id":432,"title":"NisiAtNibh.gif"},
{"id":433,"title":"NonummyInteger.mp3"},
{"id":434,"title":"MaurisEget.avi"},
{"id":435,"title":"Cum.mp3"},
{"id":436,"title":"AtNunc.txt"},
{"id":437,"title":"MiInPorttitor.avi"},
{"id":438,"title":"Eu.ppt"},
{"id":439,"title":"UtBlandit.tiff"},
{"id":440,"title":"SagittisSapienCum.xls"},
{"id":441,"title":"EstCongueElementum.txt"},
{"id":442,"title":"BlanditUltrices.ppt"},
{"id":443,"title":"Nisl.gif"},
{"id":444,"title":"IaculisCongueVivamus.ppt"},
{"id":445,"title":"A.mp3"},
{"id":446,"title":"Pede.ppt"},
{"id":447,"title":"NibhInHac.txt"},
{"id":448,"title":"JustoMaecenas.mpeg"},
{"id":449,"title":"DonecDapibus.png"},
{"id":450,"title":"IpsumPrimisIn.avi"},
{"id":451,"title":"QuisTurpisEget.ppt"},
{"id":452,"title":"NullaIntegerPede.mp3"},
{"id":453,"title":"EuNibhQuisque.doc"},
{"id":454,"title":"ImperdietSapienUrna.avi"},
{"id":455,"title":"Non.gif"},
{"id":456,"title":"VariusInteger.avi"},
{"id":457,"title":"Cubilia.mov"},
{"id":458,"title":"AmetNulla.jpeg"},
{"id":459,"title":"In.xls"},
{"id":460,"title":"BibendumFelis.tiff"},
{"id":461,"title":"PlaceratPraesentBlandit.ppt"}]
}
window.onpageshow = function(event) {
  reINT();
  document.getElementById('crumbtitle').innerHTML = "Activity"
  document.getElementById('crumbtitle2').innerHTML = document.getElementById('crumbtitle').innerHTML;

};

window.onhashchange = change;

function search(key) {

}

function change(){
  $('#content').html('');
  $('#content').hide();
  reINT();
}

function reINT() {
  $('#preloader').hide();
  $('#searchForm').hide();
  $('#pagination').hide();
  if (window.location.href.split('#').length==1) {
    createNav('_ROOT_');
  }
  else {
    if (window.location.href.split('#')[1]=="help") {

      }
      else if (location.hash.split(".").length<2 ) {
      createNav(window.location.href.split('#')[1]);
      }
    else {
      if (Cookies.get('currenttoken')) {
        load_content(window.location.href.split('#')[1]);
        document.getElementById('docIframe').onload = function() {
          $('#preloader').hide();
        }
      }
      else {
        window.location.href = "login.html";
      }

    }
  }
}

function load_content(contentID) {
  $('#preloader').show();
  $('#navi').html('');
  $('#crumbtitle').html("Loading file");
  $('#crumbtitle2').html("Loading file");
  $.ajax({
    url: (link + '/content'),
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      "token": Cookies.get('currenttoken'),
      'fname': contentID
    }),
    success: function(data, st, xhr) {
      $('#content').show();
      $('#content').html('');
      $('#crumbtitle').html(contentID);
      $('#crumbtitle2').html(contentID);
      ftype = (data.url.split('.').pop());
      if (ftype == "mp4") {
        p = "<video class=\"responsive-video\" style=\"width:100%; padding-top: 25px;\" controls><source src=" + link + data.url + " type=\"video/mp4\"></video>"
        $('#preloader').hide();
        $('#content').append(p);
      } else if (ftype == "mp3"){
        p = "<p></p><audio controls=\"controls\" style=\"width:100%; padding-top: 25px;\" id = \"player\"><source src = " + link + data.url + " /></audio>"
        $('#preloader').hide();
        $('#content').append(p);
      } else if (ftype == "pdf") {
        flink = 'https://docs.google.com/viewer?url=' + link + data.url+"&pid=explorer&efh=false&a=v&chrome=false&embedded=true"
        p = "<iframe src=\""+flink+"\" id=\"docIframe\" style=\"position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;\">Your browser doesn't support iframes</iframe>"
        $('#content').append(p);
      }
    },
    error: function(returnval) {
      if (returnval.status != 200) {
        out_changes();
        var $toastContent = $('<span>Please Login to view.</span>').add($('<a href="../UI/login.html"><button class="btn-flat toast-action">OK</button></a>'));
        Materialize.toast($toastContent, 4000, '', function() {
          window.open("../UI/login.html", "_self")
        })
      }
    }
  });
}
var totalCategories;
function createNav(id) {
    $.ajax({
        url: (link + '/category'),
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({'catid': id}),
        success: function(data, st, xhr) {
              $('#crumbtitle').html(data.title);
              $('#crumbtitle2').html(data.title);
              listing = da.contains;
              // listing = data.contains;
              searchInput.oninput = searchCategories;
              var updateBookCount = function(numCategories) {
                bookCountBadge.innerText = numCategories + ' items';
              };
              updateBookCount(listing.length);
              totalCategories = listing.length;
              if (totalCategories>paginateSplit) {
                $('#pagination').show();
                start = 0;
                end = paginateSplit;
              }
              else {
                start= 0;
                end = totalCategories;
              }
              showElement(indexedCategoriesTable);
              rebuildSearchIndex();
              updateCategoriesTable(listing);
            }
      });
}


function navClick(id) {
  url = window.location.href.split('#')[0]+"#"+id;
  window.location.href = url;
}

var count=0;

function loadNextList50() {
  count+=1
  var numTimesPaginate = Math.floor(totalCategories/paginateSplit);
  if (count<numTimesPaginate) {
    console.log("If Next 50");
    start += paginateSplit
    end = start+paginateSplit
  }
  else {
    console.log("Else Next 50");
    start +=paginateSplit
    end = start+(totalCategories-start);
  }
  updateCategoriesTable(listing);
  window.scrollTo(0, 100000);
}

function loadPreviousList50() {
  count-=1
  var numTimesPaginate = Math.floor(totalCategories/paginateSplit);
  if (count<numTimesPaginate) {
    console.log("If Previous 50");
    start -=paginateSplit
    end = start+paginateSplit
  }
  else {
    console.log("Else Previous 50");
    start -=paginateSplit
    end = start+(totalCategories-start);
  }
  updateCategoriesTable(listing);
  window.scrollTo(0, 100000);
}
