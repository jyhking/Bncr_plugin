/**
 * @name Doraemon_tool
 * @version v1.0.9
 * @author Doraemon
 * @origin 红灯区
 * @description 工具类
 * @public false
 * 
   更新日志：
      v1.0.0 插件上线
      2023.5.6 v1.0.1 增加时间戳转6位cron convertToCron 
                      是否存在定时任务 isExistsCron
                      写入数据到本地文件 writeFile(文件路径, 内容)
      2023.5.8 v1.0.2 更新isExistsCron方法，根据链接或者export变量判断是否存在  
      2023.5.9 v1.0.3 新增 validateCronSchedule('57 59 23 10 5 *') 
                          判断传入的cron是否过期，true 已过期 false 未过期
      2023.5.11 v1.0.4 新增 getQlHostAndToken 获取奶酪面板的host，token密钥，对应版本的id或者是_id
      2023.5.12 v1.0.5 新增 getSystemHost() 获取无界系统host
                           bncrNotify(title, message) 发送消息到Bncr青龙通知接口
      2023.5.13 v1.0.6 新增 getCurrentDay() 获取当天日期 yyyy-dd-mm
      2023.5.14 v1.0.7 优化 getQlHostAndToken() 对接奶酪棒
      2023.5.14 v1.0.8 优化日志写入逻辑
      2023.5.16 v1.0.9 优化 wxdpqdParse 改名为 urlParse，增加一些内置解析规则
 */
 module.exports = {
	autoMvEnvs: autoMvEnvs,
  deleteContainCk: deleteContainCk,
  changeCron: changeCron,
  sendMsg: sendMsg,
  sendMsgToUser: sendMsgToUser,
  getUSER_AGENT: getUSER_AGENT,
  getProxy: getProxy,
  randomArr:randomArr,
  convertToCron: convertToCron,
  isExistsCron: isExistsCron,
  validateCronSchedule: validateCronSchedule,
  writeFile: writeFile,
  getQlHostAndToken:getQlHostAndToken,
  getQlDbArr: getQlDbArr,
  getSystemHost:getSystemHost,
  getSystemBncrToken:getSystemBncrToken,
  bncrNotify:bncrNotify,
  urlParse:urlParse,
  getCurrentDay:getCurrentDay,
  poll:poll,
  dateOffset:dateOffset,
}

const axios = require('axios').default;
const USER_AGENTTool = require("../../红灯区/mod/USER_AGENTS")
const QlMod = require("../../红灯区/mod/AmQlMod");
const ql = require('./ql');
const fs = require('fs');
const path = require('path');

/** Code Encryption Block[419fd178b7a37c9eae7b7426c4a04203586d34c076486c1418a87681357f887728b4940af7be42ccc2e54b5a5ce074f8e0c11d06730529ea88b5a89b9a8314469c2cb87494d33b70af9afb9712017a56466fc0bbfb14f2621f7072244a83901249bf7698bc5d689ed374c33f80b260ec32d646125be1e8938537fec50a459242445f37601953e3c31582771b3901b784073aca37f5a6d9045f4e43cdefc4a03f906f9a69f572f1c0c94d6d231b4f23e78142d2ab170454d2a8a57202e708d71e3975a2cbdd1d145717c512537ed4697cc86623cdd125564e81621797979aef67e1bc41bd0370a44438d5182cc60b8dab3e851a3726f57d3c11b505cf6210af70371b98f83432af667ac72d72b618a19cb72c5c90a3195a49ff0bdd72d8b97dd059d34df6cb4ab8d1064afc31b2f51eb098c5a6d95d0867a3e9170479184f8b8dfa19c7b84a6f2928fe2d3a63ea8aa14fbf848e0f2ab1003326c3df5637f34b7986739ab3f23b627dc99fb0ec855f7456b88c3bbac2bb4ce171f207c37ceb2f39361ae6edb1921d423ca3679461266bf666b724ea373f1542b7dc6d8f2d227ce873c143ccd4dc02ab6900119454d17b8dca8d0061532dcf951859657687bbd4ceefca26f65a72c78730dc5bb014f4703c2b64ebd33d3b547869b4f4505faecfafb333fccc5f5056d665f2d37c45be5c43debb9dd6a789487c10bed4d65369d8d6455618944f2bd46baa742d875fc2386c987854d024a667ebe8ae2dff9ee8335ce07d33470420822a8363b17598ea04dd4ebd5ddb7f11eebb690e87f7dd60a3df70bb35984e579c2bb7e4587a8a63f942f7075af4ecbe60b2b538f259b2dc4ec0bd0a8b8d003916737363ae27ba9913ffc336cf7f1a2da20134f37a1f539352c8b085381a31a5cc744fdd4a4fe707b9c465faae26c0ff2842c33132e4dee108fd8e4faae16fee34006f488f42c0167936f1b6bd0b2bc1e239ff67a26d5c961cf4c0afdd9d5918fe645397fc50f460b20894cc123d8e3e8bbd4dc9f88b445bec37c0f3edda956055d4e8e3c90d789875b5b8e9b7b17b306d26e320294e4c9bc6c91a70fba9b75585028e008185426dd5fbbf23c9c6f8deb9d16aba11794007f48eb77c58b19dddfe5c656430ca6d3da9cdb73459bdb00c2e5fd67717bdad916e119f0a9478af38b492d1a61ad41b0e1ec702b41f1aae8994e839e084a83984f90351cbf7269b064af7085e032f5c481c931cbdecd47a8fbdaa95f20449be8b45bb9d12596d050f6346396afe89fde2907556216847c6eeb46ad3e2952f488bfe54ee27451eb21d41e0f122dc65c8056bf20563407aaf5c0b06663636bb78bcc318c8176338860b89a164a634ab314e75d969f7f7132f552bea2e91f224452d79ddcf01654efd012458225f3a72ed8a08dc2f5d1cdb5da0e50c462965221487638d157e27726e5884cfe1821ea151cc8805480c5ee738eecae0e84050a9e28b303e18f7e8efe20f95f2f4b943e0d2b442c2a3734de4852b2f481b42a775c24f70e310c0a523b448ea2a7ea193aa7edc56550a007f13ed742ebd47e5d7c497bdbe396cb81dfcc19b769ab3e9ff38ada6677758cd1ca262052c2391d9b6e719b96b10a57692181ebee766efccf13de6236a8c4b2b324cb40e4d6f75e3ffa853ad1e375090be3f06b064959293c7b29adc408aa68f5014b366e2d92d65c7a3f068aa741a7b5e1f0a168345281588407b8e61561f6b0728c169a82031d4a019c329eed97aabca2ea699b6fe7a9724655c58a718fc64f26cc57b2d57298dcbcf535209340f452501824e49c551b8f7991baa29d7564d9a07747d3457659951ed682558a9a1e961811f4febe84cfdaaac2e2f0173623b68f03a170bb9f5532d74372807c190f0e2346e7b3d00297c16db6478cbef6440e453f4413de19c8b59e7bc9a752ee4157b043b7a885f04b96543ac583ad314fb80cca6b34612e381b37bec8632cd59ccec725d99e611a24df554b4b0d8d4c3e22d199efcbf809d2c688f7f113ccb6b37cd4443eaf85c4c83c1c438d5474c0f16550ce5371a4e42d7f7fee65badfabbd8175ddcc73cdc547100b7f37bd5a80a916573469d3642fc1f7918b232c014203cc3aa6f92c9167357d77128846c9f88726083abb88e99d08f7c340a0d73f3ea08be251e72d46ce99045bc33cbd2080f288433215407db1e0560f59d256a86716f84e952d588d7824df2e4598ad211fcccfcae3513a8e3bc64579f5dd1e73b761b4d6de408fe8536bf96e3d9b10a4a2d31b1d0e08a6d682bc386de61f1ed3bcb12909a88d2eef583c7372e143cb0297c0baef4da2cc16df087e8e0b2a8086e5ca0fe5d3ece58793d7a64c0342602bd79dd11a6a4a4c7a728018a01bad82871c9b14950595163e52f0eea8010a112c58e500a2f3453f7923fb6d3bcc61b85964bb7b25e9e7567716fc207d04a2323d021df6b48951a5e04a8b0da0838a05a4ae9dad0e5d7148673f4d67d5618a3317276fb3761401336c7576cc65c72202b25100c0a9ee69ef7917b9e04b1120345c922ca0b53429da755fea0e7708a3c58b58b0970350da6ba023de625a7b1447207a3238f0dc6848a6020ec236d5cab8ad17f96a628c3dd3498e266c17e9da23d4ffb7d0ba11de91b7af40ca77952fe0f0be5e7429a5f2814bb493c1cc153191d6426baefb08e69f544d7d6440a4917345c6fd000ad860b262129a17c4e5feabe08ef50d7429e96a4ba64f645b21d12ea87cdc4961b0b3b21b04dc76bed0f2bdb6a58c7b1d22f6926464c303249c198e27b74326d31c4928ce9242b3bae6b9663e9e395fcdd5c2189e6a2073ba832b8bcbd2ab6962b0230548c731630675841bd1bc595e206c8c0e22f2a9906123a2e14abe88aced04b9297eab4612fd7f259e6920975c8ae0d3301b3a7b49b07a90e3c2f67109213a3e151b9d5a19b0e59cbfbbb7be2b649da5faf7b01621c8baa2924e2222eae2a598640667de6ccf1994f42d835035e6d97f3cce56f4ab3083d23c1284b81222eba046f33601328fbcd9d9d22302f162d7fe6337d36a975204a0ca9752bb948a0c9bd00f9adf7f9aaa4d5aa8a791e2a3624e9208a636678eb4416ec8109c7f43e744294812ab1676ae121bf336cfdd50c190c4b0d71ded30ad06985d51ad7aaaea7710d8612420ee45412738220912d1b5397e4b678634af3bde6abff61135ee6bc1bb6a9ca8e0c228a429e0ee46d879bebfb1c2b7caa86fe22e69d1d61c1ec362b64bce27b2ea1e10592090ccf2af5bc592a6250b768d89aee6fd5987c3378ca4471184be84edb3bcd733d2bdc37cada46f40446d95319a21fcd3a3f0c9b1b99ad4c6fa8fc823594ddeacb27588841e43744beb1000d31f16b07613fbe805a198b96b41c2024ddc4238e10514c96394c9b6ae4b6d4630f5274c73dc812a74e16ffaedad6804f3a14159a5230c578a021c39ebab3ac7d0ac37829a00acbfdf00d5b2c4011ea0da043f65820b9a560cc3ca548c8e6750d44a66ea8a410246579754de12e36b1185259a4cc1a6c99290819ee61747d0fa1b84fa14246e3dc8e2b67896e5c518ab4fe2ebc10bdaa2d63bfb0b0c2cf36ef6e74103fc172c85240c5c82394844a78005486bc39177c172b86ee8b4162bdae03be235d86c7326b013cbb3e0b2e5ba7c4acac74c7821e8e58c9be287542f85d1d30034ffe4f5af13d26a6524b92f21defaf52353b92bbb819b142b1b7dccf7242af307b7023d99689ade14601563ad926e5964a898e7fd98538c3cb2130abe89857b522778b6f3688eaa107cde5ee3f3e056c2abccc1f0b67208f2a0e2488649aa200eea80f56ae7b544fb37f6e32b94248140bfc33072a9872f4041952831e9593cac1c10dae0cd9b7353cf972e9e213152e01396c712531e06da28158d2d63fec3c3562b7a979bb8c6ce28185c5cf264874c2ac92a006b89a6530e9166fec4fa5b9437e575d06ec0058a5ee1223cd2dc88bcdbc4aaa29581ce146a0e172027d932781196be4139dddba9cda241031e4a25ddb177b9d62e5fb295561f711a95b24e51672a0b3f75716e60055b05f3e2896b1951af568541f09e2c99a5fdd3d229a8037f62dd4d67253de931e7cf543b110a8900a0877051dfc9661c346090b39c5816051a15686282c7a65f6a47b14f16c580866965dc9e200eab003cd99b9be51f0af76c69178a789952edf003f33a01b6ac1ba69f21dfff1320845afd9e28fb9750dd3fd4ca86061d0512caeba22c25bbcaa94306984fe703775164c96733a7873a53786e8bd2de949752d820bc22ebc46ebe0370a5198523804c512e79abbd1fc1b8ac0ea3eb54c4ec1bd2375e1d21430026979cc72ae867a6c1a168a0efb4695919e96bebe4fffeebcbc26a5d02931f7d7417d885ab531086af38a80b2435e9b8d0b25ae7c5a0ce40069ce9adba40290c9b115d11a7567a8f0117a04fc868c7bd98c3e3bfffc14b2b679873e7b6d5afde8a149255ff1838f95ee8e9bf91eb7f7dbf602a28534d40ae3654ac4fc3f585d685cc368dc4ecfed07d285d1f048b6f13a0f464ba389a72b81979d8d255cbfd367e0672e2b656839d2671823fb34b285dc57e0838c86f8bb7d1c5176a3e269c3ed89e6d43a665c10339faa9c530016c884eb32b53fa6191bb8c3aa1c8b93f491c79152887958f74dbd68618df2996828d0e5866f7c2ae83ddbaf5742af2da37b8b5dfb78ee2b1634116004efb31f19ba1f836e976ffc754afe4490ff24e0fbeca9caa8b3b29d06448a20661d6d98be49fb62a6c80c5566064c49dc8840ed968852f6568666af0af323813fe197de46f3477de64c92774b5e6691cff38afa339590915a8fb9f3aae6ac68ec750a78b957bb49af254780b59d439243831cf643a88750dd378cf984f0ed965de2ff0eeeb6dc2d9edadd9ed2b0f1fff43d7044e7c325b33ad96b0cb7abc14e5ae35740ce218716181fd5eef127919fcc38c1adb6b72a7e16dd8ad3bf4770f93baf87f1594e22e64724af71f55018a5118cbc0da07e84e9c13d459e9f4b9544be0523754d28fb2d3fe403ce993f2367116d0545c6bc4b8398499820c94a00e0ade30d433a9a5238935c838ad0a16be25c1cfade1aec74a503d56e5f8a39cd0040eb8829161173d94f944496e9f55d2467b2f51e7203419185b183f2e7eea70666aefb4179a573d276ff026ab1361f7ba53fb17c56c23e9ca306c8cf30601f8fa5b634317174e54699f3eabff2cddd8349db0d886c6a99e0e5b91760b278ed515c5307c1a67feee90f9eb34af1b0c1b024c8d76d5f44d68c11a2b13e32fda02ea46513de6794f044a61a3c7111b4750801d2ae82290d31203bd19ac010e69184ea7b9349fe54066643ff1747a2f569edd42f47991ebc52481d275b547a4bcac7fda9a0613dce55b56adcd1500c868dc4c78b247ed0088ce57a67eed69c46ac0f7a3a46291cf948b28bbb93d36d00f0dd9615c53c3eea9a9fe15ef2b7de3d8e93489365561e3f839f89ee15e0b2fb436fd490434cb42083c52305446c3595c36354469da5d81c2eaf1c14adebbce754c5793e051fb38d2d073d109207dc5632af63ce56bb614a09a1fd13a204c6a061c93ae30a3a73abcee25329b4ca7d417f505377f28897ba13c59efc0626848182c1f8f08b3722557c2b1be0bf98635ca33d8f863fd5dfaf0fcc82b7efb91ba8c51e15ad5c837adf0fa67217c51f9d0ccfdc9dceccb0740f57ac8037859c23224fac58a0c02452d98fbe1900131707678419512f406f3ff8bb4faacd367e0f4d1e372a4a8f9d34131062a97926b73a92fd6763814d560ccb45e556d0d791983b7d580ab9edf65bec78639c97de585fc8f8a66fac06eee641cc0cd28f3169e37856c980a65dbe5fdbda89e9d5586edb884cc55b17725acd16d87b79699f83112611e0c0563f121da417e4ed2983b6c3159aa068246dc14e47fcf0b09a5a26bcf751f4bc4ab6b1e7152e07426d587ed6348c975f58de4f09bc96a00f0390bf21d76820b7144caf7cc93fd38ca3a3c11a104e3482a7de35a7c44a466bab89b82a1bdb7f8a2a24d4440f79a4d9eb669c4021f3cc0145c2c055eb394c0bd3683db8d77021b24e7a0d839f26e52bcef3066db2fc1c10947a70a44589252eb17a0be5707499d83eded8213c96f081cf6c964a0e21e2599587f8c0357845f367499b024688a5197949905542956ba38862fbf0a44532991d2ae6ba2c5810a4a577db5e1598ea83165d5a10657a4c0cc67bef951c22ef4837c68a10c76aea125625fcbd165804c530ffaf784512d9e38fdb7f6247c39cfe2e060710310335208ac5f3e242ff44b079f7ef3c1a14b98849a89d13e93a8e2c9e493f817a4904d60f85dd396234fba28a470a366d62062c1ef2be8831151bd476907dd0679ffdd0f3fef53f5abf506e00db4ad645b6026c1f80325a2616398d9a1e606646177d25d350f9e247e8846b41545bd29be9ccb60494260f7f2af5da69ae384568396588d016a48a367ca0754f364498807a9bd7641d80dd727133c2c9671816e0a3b181517ff158a5c01f37d52641410b4d7be7cebaf0d11860b2d00d226dfc123b947163f31318ebba15087f74f2103c3616436cc56f5c745c287b86fb30481f3f0eed3d3ca76fa07e1aa67007fa554cb1974cd1e1a6c9a4794bc5adca417bb81a618665fd304b18dcda1fb745c065fb830707c497cb403a853437e9946b095621e2c562c81aa202c74f4d2ee2fd64b65a711ff0880354306829a50790070c9adbc82154ad04c218ffcf3ab5eb53680fed05b445ce019bac294d4ef72a42c432bd5d8a60a8bf45e365f82dd23e75fd7cde260cb38b5c316e5dbbaea5de3f98aa6eb4fb3db0693b273e6a8bc7910fa757632d7cae636eb13d428955e6ff3625bf20cf611d49008940884befae0695bf70b818f5b6d1eb25d364dfff9f95d2861db288d9de04e54222458a340e9f95f5adb0acd7b75b83f58f356813244a1d71dec17def1cb1ebccc51bf63928ea4b7b4c2b17aba92b03c484650ad7d7fc8bb20cb21085affa4eb2da44f4cc213c77a9558e8534d47d674bf10638f870bbc3ced92169caaea5e2f8018beeb3f7a406c2b13413483e0da2fe4a254b047d71bc9d03f138be69567367e95dc56b234f090ef604446e79a7530bf505cfb92f3604c2abd70a53af3fab74daf7fc9eb592cf87f1f383b21daf79a80e3bec731a67aab64c3de1f91ef4bd728c007fb97146841d1fe608aaad810754637d9d962cc6eade26941c401804440b780a2b8a54676f737372bb84ed5caef65157dfed7a3511a5e26e980d4371b5250c0bf64ab26e7c0c84ed57268e4ac08a55453afac2f062b560695cf76dd73571e6be86376b37eeb61edb261af5a7f91b0d8054e3cc41a643ef9f2ab2332fbd18a70880f76567643eb370a3b3e9054839e84b246f9749dc31de9d15c3590ae12568177117baed6392b233d0c6176c109a31ce03ae1723d19c183352b245964d5ccf084132ad57f8f5eeb875f5ef4fcbb612aef3cb5da76fe3802a89f65b8afc73d9b211bb466a0365f6c94ea04ddb353d10c5b52b66c22712d9be45ec27347cb7705ca32349b23776dc7616f502f36c7af5c59992fbb3bf42a1ff657cb6ea99520ade73235d09d28e18021f0387e09a50f2a09d47a279f53488a946ebe0e6086ab00a908eb324b2822dbb413af8fe748bc4c60ecfc1b275c66d1290b20db7642fc47bf70aaefc60dcf396140cdd63f3b7a4a850a4a57f7203ea4b98e023dd898e06885ea07edc9e7e31fd953d00d704893b6846f0cde8f0c4fe1528141c96fb40fcd7e564f3f2d802b1ef827f38ccd4f49becdd1073db248dfa66ad5e5a575b40d84866677109287cfbdcb9b0b8e3b7c2aeb6d510d860bfadd183840654aba4d13a90d8338635b026675a195667245e80e8c339edb31c2b8ccdc85732ee1a61b4570c82327ae5a2cbea3721fa74d3bf01b87dfbb8312ffa4ccfb006cb609d876b4642accbcea0a5799d827a3936667a807820fdb089e6f1a1728464495cf85ab769f3e5ccdb8e49abff6b0db75d15b6dba41d95046ad8b8e49b62f13187c323344e0639bfb24d4c936c33352484b345e1dad5a317b25d9ec127b0581b1d124c1d33b4f862684607dc99ec9cb3e9996658d88c79f70f65ca2a4a263d61a9d830d769cb299b4504517b33df623312283385c60e239c433a853e11c2eec1f5e9743704712ed076078777cd7a34be94162194478aa9aeaac8018e5ec10e7d0d093c1b2c0e94fd17f0cb8968513ac18a85f70831c23aae69d13058ebd872676288b7cd73641085598fb4cd68af5974a1a7d35ee577e594b9caf2376503e4e882c0d5474ee22a2c513c05240a5e3dc8e5b3cd361367049899fbe5ece354bd8f40d9088d90da8f4efe36f5dda7290f0260a59cde22d78f5fa448d11d646864bc0d35b7658a66a02fe4965e8be7a5607db81fd14f3500072ecf315814a63331ec12a8408f42406e58f9a733448529e4cacb70b84f75d0e7f558e123fd54585afc9f69e447de256a757454d671af07956f13d037bcddb89dbfe6b7e4f7f4ebf6853b08eb680d5abe046ca12f41022287555b7fad2c393eb15fd9729e34328e4034d7d9006072d4047dd2ac455d33794f8ab94124e4cae6d248797ef5a262c64dbdedd409ed5b577e0566174cd5973fab6d12f80cfb4f62152ebda272d0dd1de0aa543ef679fa5b085593eeddfa60cec2602db5019b3da06ddf96d3e526d9b407ee15499843172ba9acb522a14b65c37bed7746a0bafa71ed47adac3618e7345fc0ea5650afe957cd02107cff07a2b825ea466fa94add88f60023c30925cab4aa7d45326c09788fed6d28219c0e3f27418eb4843e6b86740d36cf6649677b17fede51b52e92922913c35b526c3a4df3a218faaeddd7f6a0919fc8e9bd4ac2f6711bf45e2778f9dc1cd033926dd45239dae24015b06743330e1a461f9098ba0514c06cd03aa2890fef3dfc9ed0bd95893aa29f9386f9d6bc1e4d88dda90ddd892c9b187fac559e861959b51a9a37776ca44fc5ea2f4667b1c4ad6d6ca756a6225cde588f669df1f31492f2c3a9f25f3368227f9ab26cabb1a26c2b55d981c7113eb5b9f95c0e842444d24f41b1cd27b10feca4770064ec7024ad2ff65cc33f6d56aeb4c0ec1a28b64cef670e18349886035da18346ec5d5f3bc4b6706d688ff46479c0b7f9ef7f2459f803e627eb5a6debe59c5d1eba5b6a769ead3cff44d3f33aac2455250840fa0c0c4add19469a9a8f3f657fb6aac22d9613170ffc0648f260a81b83b1ec8ab610cfaff5c93d9b66160939112f0bea12f43ebff4360bdf068b35570f07fe183285b8d4f41817c479cd41f9a8404715342aac76a7c9fc9384f809eeae78e2d6c6678d292b1df8c0f4ee2926517feb29dc2c1e5bb5e89ecccd4cf80d3117744b28753e2a7bfe58f74bca6a1b2607fa898bb3b1378a8338686f8c89bb06557717613f4cfda6b85b514ad9efa9c66fe12ade5356108277e94824da6215d8fbddaa4ede2ed60024e1b0a6a499b14083146143e74cbab4e8a223f13754ffaa659013e635115fda28949dec499293b14f2a86266888f10129b6adb5359034704a19cb9dbf76302b93a1820bdef10b3159ffccbbb913913d365d10722315005463aeababd44698e35e107acf38ae37a4cc165fdc805bd526cfa98232846a2d8a185df25860910b94d227bded2e00fe4a9ae852835013c21887524f0cba25aa6076f6c57481cb9d234405b2239d9d9d71625a7795be0deb8341ff60ad28c00f83ecb5a758bb835646bd87f5986559d8ceb09da13e3e97e3202d03ed0073686d708d9f80e8a34a80cb3085a973f2b6d0e4df1a87c312b19b264d17825c7c6c89b3820e05d13466f635cd17d9e699c002d96f32c0919de737d28c7c159d0a693ba289d77b7a725f2d2d8caaae5b54ca9d4948ee0d3470a83f731d927a8ce43f8e70fd0d5b9e835120665bfd0c6f251cd9f81c82f9b7aec97002c5a57822c82700dbb40f67542879df67cd7ddbba1895639916f992a71ac79f9c1fda7e83ed47cc5283225863fb8be5ffda6b45156de69f71a9e46598ca3192ec64b14b029f67d83a19e18a32397ade82db124424f15cb764dd95c02607e7cce3544459bb7775f5bf32fe250e31e8bc3ad7175f611c90a9f651632e9fb09b5d0765c4c82ae53c5c38041f2cb373960f4d642a243e5d34b02b5014e89f8b41c3f326a4a5285c1b8e0f42e0a6ea0a2b6c4974a69bbf7962f62d12d2353b877bf59334383475b628e46976dfe360179a048d65caa25b0c1f8c3c333e2766caa5ebe37ce6a1108099e95d35b250bfde0bb5975af52db9c84bf68773db104d9aa830e35f116a7dd91e360efeacf5975bf3f2ed6d4aba4c58af557188cb8128f337125cdf87ae00d6e15e3a186d925edf93cb1c0a3ae33b002049ce17a9de6ff5757abda8bf472e232573c64ce0d0e91b6a4956e53240ec9e0ac52d8c1739e2668b631619ab3eef630dfe7f6537ab01a730302dc57030c7e8422be1bf4bcbecb15d23cd96855db44fb0e61d4465ea4d80299cf99261379487d9a4ac799da4d3f82b22bd5a0e47e1cae5bd4795b50e3ff0fcd187280f67273741a0b3311e4fd54b697735a1acd792827d6279aab778ef4e14716208e8e4d8d038db0bea9fe670d38720441e68b3cede7a4549c637741081f9e6879e200fade03f65e2e9bc3e09dd72de5955bf5a977be606e7f5933e4fd3b72df7d3b9b5d8741391213048927a76544db8f2c296776699e326af666881dbbe4e496226abc9cab0050b7ab085e62c296c73dc33561e85e452e327140b9bd831ccf46e7c61528196ac69e1f5da95dea2c6b685ebd94e11b2dd667b508aa6e734fab6a75be4768e1086d5223f4eb6f9051e7d21940aba20e1119015b6fd624c8e51d3b48f2139e7f565eaa4e813ea31deb9304b5c16a62c8f8a10dbc33b9598fe6d9a650ff4fce98b20e322b4442ff7918e12f60e7a6464ce6afd1d177f15ee46d1fc9640b085dcacdd7dbaac33f7c660d45a2592dc4a559e34d3c4d68c50241aa99be7e853d161e6131f7d4a082bac8264bc281c749b3e45396e8ce5ca959a58f36675c13b123436ac7915093b4c579428d3893b1721a3eac057cd52c43795e8bc8c8bf71cd28793e5bfe08112d8b182e2d905e244e5a2b900733ddf150bcee6e7ede383713e686318e25a05f07f712313c0b9a185eac24e03bca0e0d949fadb262793fa8002660be5e6bfd9dd8d9d8679b58b7da72e4b3bcda2e3cccc58735c9cc9284158b23fbe152590fb6539ed395f031e15645310921f5cc698d9665f7fff69481d1767f1706782cb36af125fdaa1b33b58b6326c5fd4f4dab155ffd427f9d5edf46aafdf3a9adb67ec03386b3e1f7cc766310a6719191177abd8295f97db41c116a087caa6f79e7f7f4265f029e79e885d84f894743719d7bceb9f041f4165fb0388ced95bd62c73323c3b70dba56f82126db69f623acfe8f8fdcb8aca4616a45f71e5ab9ff4a55a250cab5f7871a2f3679a3314981e7aaae90425bc5992d1a0a448a638745580c7146aea5e46af700b337019773979daf2587f92a80f48f5f3f0a8c02a82950dcaaaac0b31224f4bc731d659acef485da63f3ce6b85f5726d8786e85c032e7ae9e837198334671a9621493e505c9e90269db6322515b05d520f814c155d652aa39e6069c38566e5f32779320f6be0ad47fb5136c38918e77ef4bf869ea8e0f0b7f5a519ea5b8b639d5d91b26047df3a7cd13e762365bd1f9b91f32ed5ec998037e764b3dcca7c0be8b60927ea7cefd56a2ca8006da2f0d78ce548259a727a7416e0ee33bf2582625607116393f1d65babb9d7c82cabe41b61e71b6a729e5f37c637d20a12e8ece2ba187cb02e7072bb4c402aeb961b9913f57a2e48dabe031666d8740a98d13d5a169c481a1461a73eafac1792cf0138c0971737266b6208a07d9984b3958837b560df13d40da2b0ea8ef149b10455a28b59c1d1ba71b15b60ae126c3315cc95e08e6f29a82cd03e3cc1ac0a775bcef14ee5a3fe4a357b2b40ce9c30e2339daa3065db787abed9d387520608738e1834350bc054a50ebe66a10e08f9a22073754a2937ee7958b46c201462e5a537b28620c479ceb63504e7f1d4ce5544ca4aad4da6205fd3e01147c1a8ef9c35e9a80e73b9c5051db80e4b6fe7bdaca88f13a25f619c57cea520163f7644b6b9ca9f2bf1bc26ca188eaae61cde934a7b3a6bb7f0a9f2fd88aab509c1de0e594e3ad2712f9010711d8bfcfc422e8bc8348952dbbeb711a12b4db4e3aa57825232e1a8a33aeff949701a06500f3c647ebee525251abd34618faa00e7791f879a6b271697a27ae66553ab9c0d28b9f8bb18b86dd032a2f5d9d51f229e883d6340776283a7b97fcc9e166d8b33b9aa7541f6cb5c30a8485d6f557adad1ca3ce0db36e4ba76ab2d34a5ef740f9928d613c3d2f2b7655c19170a6cf7094e53c1c2b3120b805c9690bc17777afeb2ef97700cc571fb71f3e441bc078c0b202123c4b30b552fb10f9375e3ca899da6cc91afbcb93d1ff0309ef9e1f6e2bfad5b2564c90fb7baad8457ca4d03684bca78e1a00e9c868c7d45beea0607f6f961739740e2e99f71b996654586fb1bcefc8d72e26a2b1bfa69aab06427c79a5d5cb07cf6be7e8f02e48f0ec13786b0d1965142f9c7a24c9e5886b83cac9a1d80626a5e223ed00460532d7f677ab97bb7a53060ee7da5ed64d5c807af63b6e35007bf025ee977ac1f484d4b7bbe7817f2aff689af352bd18682872b6c3d648323a1855f7f2ecf3110cf12bef9475c859c50b1ff0ca71dd033e39bbf4abe2869935ec4dd84ea7a7bf2c37fc258f7a30c413028152318729db24749a1736d9d40c45a42a1e2be06d5b2dd2bacf2e83a0154bcf2fb7147485473f5be736b44b4ad47ad6ef0b44d7130c693cd3980810c52a86e628d312daa02d01429e0aecb80c9cf39bbf2bf5c407b09a92785932d13ae847823b94fec2ad0530b8b81849108c2a5299ab3466daa226a9eb5756310554effd26dafe266a791ac2bb32840b9ba4f02c94efde84e071b5d7574819e877e7557366cbf870ae465bc99a033265973c2eabb8fe2d4d25bb20b017426e051b780f46c09354ca21bf4f1e72c037a2efc1a51bcc16cb2e71a6f77aa80394e415e090109d011ef81f432c28d991f43361ef429c2c3c10a646e71720d52e412bae2f682d3fdaab454d86d96805e4f298223a3d29b47e008572cfaf21e298071d29c182053231db4cec44b172839ec5f01347d0daffc3bdaba1fe8e5f3b85520794d157e6950a1c3bddaae1b7d23652b6e7b640a334cab07b68da51d48af2fdf77386ce3c5aa3224e6b99877d23d1cc9dfb10266740d93a5f3346298a544d17051b8faa1af87f159ee846a1d70e0912b6d75c450f178ad46e49ccfbeb1e2f47c74984032f1a9801c6c215c352c08f277adf83f3da82da6c671231ec6912ac62cabf3a56d0ae8ead9c4fe8a27a3b97facbc773a1b5345a7637da63776294ac986fb76a87f67c4c20262a3d2aa7ea84dc6addaf8525fcc82b2a0039fe78bbc486326c3a9124144ccfcca227e9f70271d9667abbf2726b5fbe2971b7bba5539d159010d167d29865bd0663d1036ca884996d5d1b4374913fa551c7fb9b78173e62fb8ae4375a5bb9565c85c738cb6e8967e8c9a6afce69404da2329335a67c8657a9a3e38bec4f3ce640d2e82d57b38161ce9da92611a366d72b34cee9019d004f5eb251aaab12832bcc9f02043213b24fdd5c7b106be3fe783a454c35ecfa2d610c0d3a771fc9879a0d690453a8348e9772b1c4f218d4b6a92d1d19fc0679588f6c95c051cb0623d722c638e903ea89c6035cceb9ed34c238fd7ba1d6c42cded1f818722647c22f011f64a3b73a209ee11980c71a45e307d0f280fa1d1df746947dc11a851cb2e15a0f5e2e3c82197adbde8785f2a94055295cedd9d621881ccd9bb8b1d49623800e1e7a4bbce7aa65a58b7cfbb47ea368cfa223e868da7df3183f75eba875982a6d12687c381b30e0deaebc319187ba5b6dad894082959c868af74532a05fd159b08c07601517de23062f9a5964c5b6af1f5cb7f24245166e208025b1be4a12bc9a9a07c69e6d216e46e47bdecfe5b4fbd4679d9c44d38f8d4ef6149e88b5f482c5f4204dc4d3764c958204cda20f441f6f2e0ee9fc496a455ab71b007285503cff5759478cfbfdd41c4a8e12255de10440d7ee53c6dcce1ff8890cb1e1b3f6a9122fb62c2d6633a3a24a3bc0f5ddb8729ac425f26fd56c3dc9a56883afd37cd17ad1624f4f03e6c45eb1d08918d8c4d6992abe3cc8e2bdf62e5a9299c6d0615e23e959bc35928dcf3c6245be96f51505f9c5a17495790906234123877c519567705c831c56096f774e8872aaa4fa78ab77c2ea189bf352ce82d230568d1f2dedf614dc23b2e0727ed9503b35fe2ed722cda979f7725110c72036b689c26139683795799e8b527e6b7d13ee5d6d44546766e0552b25075ed929aa8243193b5702bb85cf2ddc7dd13b68d5d4fcfe4fe05b995ce749c260de3c91246e99a2182d37abbb69a7e85fbf56b1d7f1ecb3012b095e4e8186b86f93fb281d242a042fd8946f09abff5664473324abc385067c3f2263b8dc629f1af5929ba34e8a0e2d1e0e1dba34360d7860630867255627ba0c80268fed7dfb8a51631de7d9526f286c8416d9bb3ee9b11135a47ec472ad808d1bf7568f1a8c237ab83b8157db0ca89ec00307803e92dcb18cec5b91c05997bcfe1bebd8b7d4fa1461fcc1c23573772e0751cf968ea6ef603a04d655af5e4c6920567ebe8c073df154fd917a32b6cf8e09a5ca37af0f4a153a8aeba1b1957e52c15ad8cd7335e4286c4c93463614f097022ccd81035d5d697496463a766de6ff35ec32ac4879643f28e3a888de1fde9946de11d90d1ed4fa26a7587c70b3ebe52e9d409161b09dc497f3c6c0320806064b85e084c7847b4ad3b8f4354cc38869563676b6a4762d3b6a54b15795cd26e1496aa7c2173c9b3bad6a1fb9c771aa54e3f4fde1f88575c89633feedfa4534d810c2dc259fa79ecd6f7ef0e7b115994f95d5aa4b0c7c9ae4b3385407eda4204b7370ca9d3b3c5476ff6c9f9aa15cc0bda57b87895c0f372e08c3e4c4792057bd2f3038e1a9751d963be44c1715d8c42cde01815d31905dad1fd3101d521396ca0daf93a968d046d0ab13b0cb9e93c478a0daea3090c851973b7b55b1203682e9c51b2a3bd91cebf6f8f4450bb76c86bcd2fa8287b73e3b047a528d01377e6fa4637fac94e4554e0698c48e257202304924f7a3d74e491ed7168dcc127ee859cf02316af8a13b5d3cffd56b3c5b3cd7138f4a2bbac6fdd37d28bf658f5e4cd7fb153c55d0709e28d854376acdb2f212db060962bf352f47f2b572c4ee2affd2be98ac37475cfe4036f55cbdc1ebfed49c7d85325a97f948fb65e98363aa0d3e2f4d96f3f0ba17419936d2836b5f2e1216fc719a0644809f16fbf29764c5a48687fd2c59638a0d1d8394e401557ccefa00d3a0fe3ea0491e47ba4dc4e4a78c4cc97b9bb31d795f56e36f0f87784cd4d97a6b0ab70dc6f66cbb04770001c4ba2bbd38c58409a1be5a2110f68791ee070572f6a9838211baf7e634644b7a3afa1659ca9b11e490c9fe85619a138582a8f8763a4db39279288964365505b3e9c05b4ce02bfb3214027094e98a7a5f1d07c9e31e366a3692ae905de5a5e9154c1ac774f2f00db2756cc986dbb0ad47b8ec2e8c15ef8cd5db8020e9b603282aa2533f2e30b875ba50fce035c93bd2479850fc0810998eb636a66975e6f8f06774d33e324d2db85c7c387a2b5b2ff29a9fa281b4b6ef9fe132110acc70019b3e1aeb68c13b7e7b7a550ba506a9772dab94241ec86a2cb75b3ce1f9e5817f795e03ce2a86bed6473080bf09b8afdcbe224e8146ab884fe5502dfb5928494f1c6e62fe4c2b2abe368eb944cfad72d65e4da215a440e1f99b7c2454d1f495551fcbd583ba47efc8e4bd40cd91580d5c2d784d57e4b3a24f46d6e583321206a942949386bb29cea2401f8ab9328855ef846e4f7e12b48763576b4d1b893fcada2de394e1b2477876d3c975253d9ded2bf8ea8dcdbcd0e7d582730d5be94c23c9deb9637d8a9e5fde6e8dae8446eac5a1958f784376fbf5460463f6b13ef4cfb8678db35d14de68f41f032b54594407647a4eb93b4a5abde24bfd79195fb38ad2ed5ed30a5956e2971b48f019e75142f49a09591b82cab237d624be72bb666d481bfefe4ea203cfd92a8394f6d6052e8dc34c837b99b27b39ecb40412024c0313435a691e81b322902b21cbc48ab1d405f30d88d67e693abeb3e41899e7c378637731bc0023d93b8c70dc8f92d7171a5a588561c21607e2f91b60a5aeb2d4d2d0c17d05d256777fad098ea0c1386352d5b0953dd647882f39ce289985aa05abae8b8ab90fe359a7eb6b34dc0c73c0edcea1fe67dca0e1d4136e3b3eebd3068f59ee801c211ef85aac56203301b53a72563484a05cbd9fafc72c9c264e1f5fa4ddcaca72ad61114bbbc2a1f09cff562944d6153f9416ebbb83c53d4ee617d0ce73b44d4bca2d9bdc63271edb89478225ac77d5d4dcc8dc5a236dfbae910b05bc8ee7d6b360fdfdaef7316d9bb4ca9ad50f71a0c8329b4b17d5ac0527a95b2db652109260a66aa75ca3d62e69d3ae6343dedf92634554adeb98442521a0212b8906e8cad96e45122a3f16872aefc17bc7e596252dbbc0e998cecd8e20f683b3be0fb91ed8dcccbe73f3773ff262661c19165afc6b1dbf718e5f87f401d6bb0f42e82636df3b50d655deaba63189b06b7a9d3b2c7d0572d60679d6a3295f4b06b8c3a38871f67e50bdc3b34935228795d66c235073e0d66b32a29a9082e800c02c0970734635a3cbb65b573b8d83cf9d46507eaff1f5d50b9d53a65e2473ac5637eaf6d5649086b14ec598b62620ef7aade1b3af5fd5a61671cb4da590a3b835a713482e44aeb77749177e6fb26a522e78a3e59268edd1da4b2baab4a59b4cf11cf0eaaf613f8c806cf9da48c115d506c6d110b86b4d9c4ac1bc03b108184256fea028219e04bc89c1130985d850e98278e3217e961b07289f1e4119b262a35e7a7d9cb2aacc21f1d097c75b62ea7be97b1551d7cb09fb3714c304c89ba18b53062ffd8908e167aaf8d91815c55fc4bc0aa1e9b633ec7be0c85a6d7f363f73550c7e1a75865c770aed53eefc2acad4135882026767f86551562a342edf844a5e7f949f099bcc4e47c666e76297c80af5a34ed23980d545815d16e6b2ad1eaecb6d097cb414fa782997b8e72046c93186e0b4fac0d1d1cb6aa55690e35988849e7e2d3ac730aad5bc9d1a30159c874c84e290d36f6c5063ae94b9e05ec0f5fb06ea01b0d88b535ec3fd60a8c965922600ec30723241729e407c4af231dd00c43831d4400348c384524cd6c2b1dacc3ea71c4a66f9890879a984cb3913cc7b6cf5adc4a866f4100cefadbfcd8b3832e95060d34242d0e699160a372ee65f76ef1ddfd9924d0f52e85fb654cd1f06fca5fd44b322d28328eb4458778da591c700112abfa840c4d810cb059580c449e50443ec28931e34ab8cabcfc846f2515569884db1d1025b09add72ab295cdb6ff0528dfc9f25be75787286bb699226748de5834b960841b27b78bf7c3fc17e5edc931057f9a5b8de5b4aee9e640045e3562eebbba797073016a457642e90657629608907da442c3f21c0f32e65984509b23d29420f039b66174ba8a14912f7040ace23be6ebbd51b091eab862944a5cb8608dec6393b6c34f4c7db932c0fb952175f2a474e5414d50c835195937fc418c7760bcdddd26d1a5bbacb61c8823a3c450849548cfb16f86ec9b6a3cbcd3206580e03dcfdffa632f37d8e7df4cdaa1821a01eb73fe5a8b7a6a5df0ada1f8f3d7ad734368d51d35844c0bad4cff570974c1cb51aba30127d46868fbcebed1fb95a8b7fe0b6fdafc61624b91391195c4fd4fcfad5a3ad33dbc67d6eee2cb129f00412836a2594f5cf1c6d1549a628254d91436e4661289614fd5f3652720ebde01565de681ba79d2104c7ea65051b1041d51efa9a4563c929feefb0aa193e1ec476154a31635bba9920b0562bc2796f0db13d4e416afb1a0e0a8799dc5d0ae909a1a9c59989662c8df19babe2f9ed89ba4e7790aad6eafedeaab69b39bb0d8a74ead440edc70aeab1ec4844c8fe5f7d1b16dbfab9866e7dcfbc3dcf98df829acfb727b9681440d7d86679e146e665c04e2cc935cfaf40fe1921a4e6d01802e65f2cf14fd05b2f0ad0fc73af1938d4569c4ba9ef48c6de2ca7e8955d20b16d0ffa2791c9ed5c19bec3f03424698c3e213e2a938882df1d4826d10a6cf36bc3556f214c3ad1ac4185d4afbfb6562250cc2da14b35ced39694124ee21b9de725e3b66779787bca633e25fdb7afef9fe2afc872758c0611874e277daa7ec7bbfcce3848334a949369b47e61d4953cfc2a6067577a1243e6628a0a3eef3d31a0e09a80237756fd7b9ef355bf5ac1679101640dfe0e9aab78f70c06379f77ea94ce6656eeffcaf9c545accd82aa1ff122dbb0667d364bb876b795648e24c5d6462e6ed8245fd55570ec34bacde5e4fa7f252358465510806e8dd4c2bc0754a7647f371998b85c062d97242c4b201096fe1421844d26018b85e2b2bb3d29613a15a2eba499543b114c94dcc3a668f5ba0cd0ccff7879a8671d99d0f0e7d55d245d9615b70ef27f01ec0790fc4ef158e01731a267d5bd2003a12b95157c2a40d7b0bbca744522fe6bf10086804b0301de84b5eb43c1973ca1540dffe208bdbc75fe04d464a0bac76778b0861ad819a92d657371f4656ba54c58923b8e9919e8dd38e8c9954f3415da156a15c83fb4e77e99654d7e467f82f64c911123d87940fe44a0d8293dccc15fabcc878668cd1d1a913391a1530fdc540a95acebfc19db30835f2b2c9c1473ee29e76efb9b4701b27a618e37c52c5694ea94a40221a3f559383b2b86babc54e7e35be12bb9faa101abdb9d05a5fd8904d6fa2437230d3c940c14cda83bb85e51f472bfbb36175eb2e0d3c7707e9dbe0f8bc0f5f6cccaa7ca06bc3f15624a42c18e4df45b40cb468575ccc752776022b4b71d8304f747a3b1a9f6f20bca39e2662e5de9cb39e54a1724cc3a5fa138cebcb56caf071acf5df8fff2bfeaf5e991155b3bab1933ef00f78397f0803cb3e2dae09f0a9f9f960a00964265aa3ec0ed3e3f5c7e45874783efb02f60d5cc2e91ea7a2ad31e83128bb9affd4269ba906eede80a9ab38336d3641700a1cd7f0e87873cb67f3e82101887da73f9e37bbb6b2e62f43b50397d8a2012f5c6b979659a3542139b1ee0e6f3bd6fdbe094106b962e2336b25cff65ed7b0ead11a3508ef227c5870a2d66d59e5ff64cffae1a369f76636950191565550693fed926e443680af42e133ad8aa0dd1b1eb4529a0bb7592b82644ef79653935f3a77efd40ca32f1c0e003c0cc507249076acbe8f80f429ab8441d6814a284e346f7a8272b3fb399ffcdc5354b4808d1e80e0e32202cde06613b0a77ad4e302c36084a2dbba764ef7ae31499af196d5c06855d6f847e0225a3db4695198c45c7646d902fca34df18306195f602bcc8c6269ebc417c779586f21a8d21c69aabf4c2057de8f51ea50db5577974f2639a1bcc8a354532489ce05fa9fcdbb2adba4901a1a4a12cc247bd3b321d2ef5eb42c91e037ccc5de5d49066bc93e517a0bd402c23d83e1ae5a6f3cf9fb465e5b36281b50f32c191a4eab3aeb2c0e7354e15393bedbcd3e95f15d3ac736b883408aec3c52c05bfdcdedfafd631c171d1aa3838fec7eb65c32e6eafb26dbac2fa2d9a62a785281d43fff01bb6b4cd444c29e352a8f4bdaf7c440dc0d5e67018e92aedf951438f96670a0f44999640899a33f63fb2c86ea1f6f34c27bf38bb7774170de137925c2316eeb7f0b1659d653372ba3b80d03aff2367a548a6ed57def6581d6ff90055e0588c583d899976dedfb8d67ab85a49c3414e04605fa0a436b6e8b0a89044da9fbb4eba9a827e95ff614080087c138209bc1ff50fef5c160b5ccb7d23f59eff0cf4fb3514752f60e05640512ca73407d606e42fd7641835a026d69055b17a3b6ae0a52488ce5c5e1a43cce3a2c60a8e782035d2a1e95646d18beb88e0a01301115ffc43de181d6207f770d6ecf4e1cbdaf71577195d8683d1a560581cebbcbf664cf4e81acd6ed7d0ac1f4b5abb9320af94d6407a48d9a80b3faf240095faa383fab9437a20cc8f791db2cdcdbb423ebe8a7d662a1ee98a1dc75a6] */