require("mocha");
const { requireBox, getBoxesDir } = require('@liquidapps/box-utils');
const fs = require("fs");
const { assert } = require("chai"); // Using Assert style
const fetch = require("node-fetch");
const ecc = require("eosjs-ecc");
const { JsonRpc } = require("eosjs");
const {
  getTestContract,
  getCreateKeys,
} = requireBox('seed-eos/tools/eos/utils');
const { createClient } = requireBox("client-lib-base/client/dist/src/dapp-client-lib");
const artifacts = requireBox('seed-eos/tools/eos/artifacts');
const deployer = requireBox('seed-eos/tools/eos/deployer');
const { genAllocateDAPPTokens } = requireBox('dapp-services/tools/eos/dapp-services');
const { getIpfsFileAsBuffer } = requireBox("storage-dapp-service/services/storage-dapp-service-node/common.js")

//dappclient requirement
global.fetch = fetch;
var endpoint = "http://localhost:13015";

const rpc = new JsonRpc(endpoint, { fetch });

const contractCode = "zeosweb3apps";
const authContractCode = "authenticator";

var ctrtStorage = artifacts.require(`./${contractCode}/`);
var ctrtAuth = artifacts.require(`./${authContractCode}/`);

describe(`ZEOS Test`, async () => {
  var testcontract;
  const code = "zeosweb3apps";
  let dappClient;
  let storageClient;
  const boxDir = getBoxesDir();
  const permission = "active";
  const keys = await getCreateKeys(code);
  const key = keys.active.privateKey;

  before(done => {
    (async () => {
      try {
        dappClient = await createClient({
          httpEndpoint: endpoint,
          fetch,
        });
        storageClient = await dappClient.service("storage", code);
        var deployedStorage = await deployer.deploy(ctrtStorage, code);
        var deployedAuth = await deployer.deploy(ctrtAuth, "authentikeos");

        await genAllocateDAPPTokens(deployedStorage, "storage");
        await genAllocateDAPPTokens(deployedStorage, "ipfs");
        await genAllocateDAPPTokens(deployedStorage, "oracle", "pprovider1", "default");
        await genAllocateDAPPTokens(deployedStorage, "oracle", "pprovider2", "foobar");
        testcontract = await getTestContract(code);

        let info = await rpc.get_info();
        let chainId = info.chain_id;

        done();
      } catch (e) {
        done(e);
      }
    })();
  });

  it('ZEOS Upload Payload (authenticated)', done => {
    (async () => {
      try {
        
        const vk_str = '{"alpha_g1":{"x":{"data":[10743384851791489833,16151200417142004433,3486072283009176738,2359704508242334157,4708476084099670530,117978659527193769]},"y":{"data":[13957980117130975030,5822048176370104852,1339558264020996111,1532176014662337896,8340395934102853712,1522755594305001437]},"infinity":{"data":0}},"beta_g1":{"x":{"data":[16336276466035058004,5655388751077479477,1679015989554504750,2623669155576461081,3935913039170219345,154166148320031076]},"y":{"data":[8644335105712336194,12131412578238388818,13121685135007799676,1181734283780229093,7508786078344332975,1626746759878785135]},"infinity":{"data":0}},"beta_g2":{"x":{"c0":{"data":[14683346903100073974,1666718837225419595,5633598055022532106,6513267455984322387,12696530528544167067,582756158093453604]},"c1":{"data":[3420528671943142140,14222245016971183456,2176882552115121043,8801619206015550765,8916460120321652234,173146702777656485]}},"y":{"c0":{"data":[5229810285136009575,10337769438408412402,6268270359993352066,4125159541573391480,779602930788866821,149090053613976319]},"c1":{"data":[2610480942531910736,5475195225999623490,11422087897356630362,14677561971768792069,10838708332151616781,1735190093784600374]}},"infinity":{"data":0}},"gamma_g2":{"x":{"c0":{"data":[2794433170180859567,7064600856466887598,12201975939530329049,9515626992149925907,18157212290257703914,1366911823468187920]},"c1":{"data":[3593013553623095578,8439735514307417609,11842281694234360018,12369263433056225414,8421145686768483154,716645400371106243]}},"y":{"c0":{"data":[8541385706149520710,9071235911008739966,18316841060326806620,15864212296116637958,11395887112706860157,1016488696475916781]},"c1":{"data":[12385799808150148137,12804087564757670396,2328128474431562616,6007774044674591807,12432565084585985708,951634616407578578]}},"infinity":{"data":0}},"delta_g1":{"x":{"data":[8627667892921027099,12165335264705416714,14374326914122215574,11448342927035616156,4075332379949178241,332106812812682765]},"y":{"data":[6110026689438337031,17562828516092098021,9803564303331538501,5776581761860589673,9962648949175825151,216877563980391245]},"infinity":{"data":0}},"delta_g2":{"x":{"c0":{"data":[18059653376801834460,4081407148092412111,6942955549908037155,10121673098419690888,16184483163751819094,1298142748417881665]},"c1":{"data":[9395251418400809222,5418837050998788981,524227774794659679,16868833676259445004,5263494482361274251,585646204315210087]}},"y":{"c0":{"data":[16739784735331559919,1648743447891671405,8846660640161867074,17732140527320760345,9938171135438388642,13490147628417654]},"c1":{"data":[10594112773914910438,15402869028253737547,15602805270476857782,1001640825967860647,11908682065912839655,458958534053967746]}},"infinity":{"data":0}},"ic":[{"x":{"data":[15346966027547093818,6411204378235976676,5234623727307616737,17680489148913946050,8936698622347372480,1003524326246725090]},"y":{"data":[454443256999861957,53440351173102560,9870679934901729919,18193802346729527754,11274054807968347382,658109242880508951]},"infinity":{"data":0}},{"x":{"data":[2660250119366267882,7344684222782227679,7359655539248956854,191157781886424297,14886754476477574807,736234593478700187]},"y":{"data":[2010863625819379920,4886564817472820955,3280047083358996279,4666658994511466890,17118581219092364687,1061308953101415749]},"infinity":{"data":0}},{"x":{"data":[10758570710829461064,11689881356114913902,2913550897319063237,7782348307822869276,216281277844080332,1125599416512488514]},"y":{"data":[1159011061255085614,12957425220883659835,7895363425667529718,11961224213543660359,5263886183803976470,1623618169521695125]},"infinity":{"data":0}}]}';

        const proof_str = '{"a":{"x":{"data":[11281214743188095108,7324960852881245773,16323074521503261530,7935442180524566485,3447205503407154254,142696605983680825]},"y":{"data":[12959333984886701833,7557107698944420430,10229267066654835700,4267746412519327896,683852416278172248,685037468885050226]},"infinity":{"data":0}},"b":{"x":{"c0":{"data":[4489172262238247121,65327003249188103,9875490749400609176,9708019759866291059,13811407545776824185,605904864226976272]},"c1":{"data":[10857120443589108310,8117251748703107106,4071018462117451686,9539327385730157308,5187384769016239525,1229022557506643579]}},"y":{"c0":{"data":[12371344812501916242,13880608924742898686,12684360797548923548,7908539914859763307,747934384853808855,291739538199426247]},"c1":{"data":[8700430337445437660,2568693626588558167,12346231620464952391,10857595540458505831,2666845546159284308,354222503363084332]}},"infinity":{"data":0}},"c":{"x":{"data":[685179753558974742,18240946522920941153,8481567336493327996,5233494953992381856,5791281528757539263,1501267797956638369]},"y":{"data":[13024671334677689105,17824851971584033097,8770117755147595354,11381201407111114616,239678930193425203,953532897345263433]},"infinity":{"data":0}}}';

        const inputs_str = '[{"data":[11280786627794629505,15465988939752547151,1510186046958900449,7392355891667949747]},{"data":[0,0,0,0]}]';

        const data = Buffer.from(vk_str + '/' + proof_str + '/' + inputs_str, "utf8");
        
        const options = {
          rawLeaves: true
        };
        const result = await storageClient.upload_public_file(
          data,
          key,
          permission,
          null,
          options
        );
        assert.equal(
          result.uri,
          "ipfs://zb2rhnmSXAw4ZxuqwoEpvHSSVKTGfE8wJCpWyCLTXpnxYo3xZ"
        );
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    })();
  });
  it("Unpin ZEOS payload", done => {
    (async () => {
      try {
        let result = await storageClient.unpin(
          "ipfs://zb2rhnmSXAw4ZxuqwoEpvHSSVKTGfE8wJCpWyCLTXpnxYo3xZ",
          key,
          permission,
        );
        done();
      } catch (e) {
        console.log(e);
        done(e);
      }
    })();
  });
  it('ZEOS set DNS entry', done => {
    (async () => {
      try {
        var res = await testcontract.setdns({
          user: "zeosweb3apps",
          ipfs_hash: "00112233445566778899AABBCCDDEEFF00112233445566778899AABBCCDDEEFF",
        }, {
          authorization: `${code}@active`,
          broadcast: true,
          sign: true
        });
        done();
      }
      catch (e) {
        done(e);
      }
    })();
  });


});
