/**
 * @author Doraemon
 * @name Doraemon_续费插件
 * @origin 红灯区
 * @version 1.0.1
 * @create_at 2023-11-23
 * @description 用户续费的一些相关功能插件
 * @rule ^(我的信息|授权过期检测|备份授权|恢复授权|初始化授权)$
 * @rule ^(延期|减期) (\d+) (\d+)$
 * @rule ^(添加授权|强制更新授权|获取授权|禁用授权|启用授权) (\d+)$
 * @admin false
 * @public false
 * @priority 1000
 * @cron 0 0 8,18 * * *
  说明：
    1、在红灯区同级目录创建一个文件夹，名字随意 如：自用插件

        Doraemon_续费插件.js 放到自用插件下
        把收款二维码放到public路径下，命名为code.jpg
        创建 Doraemon_授权备份 到 public中

  ---------------------

  设置变量：
    授权备份成功提示（不设置则默认推送给全平台管理员）
      set Doraemon renewal_plugin_recipient tgBot:userId:xxx

  ---------------------
  功能：
    1、命令：我的信息 查询当前用户绑定的pin，最近30天的京豆收入，如果授权过期，则触发续费交互功能 （已实现）
    2、命令：授权过期检测 定时任务，每天8点和18点检测授权是否过期，如果过期，发送消息给用户 （已实现）
    3、命令：延期 1 5767715991 延长5767715991用户的授权1个月 （已实现）
    4、命令：减期 1 5767715991 减少5767715991用户的授权1个月 （已实现）
    5、命令：添加授权 5767715991 根据奶酪棒的绑定关系，添加5767715991用户的授权 （已实现）
    6、命令：获取授权 5767715991 获取5767715991用户的授权信息 （已实现）
    7、命令：强制更新授权 强制更新用户的授权，！！！请注意！！！授权日期会从当天开始计算 （已实现）
    8、命令：备份授权 备份所有用户的授权信息到public中的 Doraemon_授权备份 文件中，请使用定时任务js配置定时任务 （已实现）
    9、命令：恢复授权 恢复所有用户的授权信息，从public中的 Doraemon_授权备份 文件中读取，恢复时，请备份文件中只有最新的一个备份数据 （已实现）
    10、命令：初始化授权 根据奶酪棒的绑定关系，初始化所有用户的授权 （已实现）
    11、命令：禁用授权 5767715991 禁用5767715991用户的授权 （已实现）
    12、命令：启用授权 5767715991 启用5767715991用户的授权 （已实现）

    13、后续考虑联动登录.js，针对没有授权的用户，不允许上车（待实现）

    使用流程：添加授权 -》 我的信息 -》 延期/减期 -》授权过期检测
  ---------------------
  更新日志：
      v1.0.0 插件上线
      2023.11.23 v1.0.1 通过Doraemon_config 配置的cache_type来判断是否启用redis缓存，适配无界本地缓存
 */

/** Code Encryption Block[419fd178b7a37c9eae7b7426c4a04203d0acf8e9d7918158369f18cfecd68aeec8908d5705d7ea8d5b181eb2e8dfbfd7efbaf34a1038c0215d88e7ed025d48086ca36a341a1f25047c3a7364aeae1621df8ba59f9d61a9a960bb4dc8e226ad5faa766c531cea41673f2e71595e30872696d3f32449d2aef8479ecd1fcf35734f74497a65518859a54bfed0792e0ca337ad76c5a25fd6d4fccac5c8ece98e297fcebc83f52a1ec697626d3fb6422406e70da31285320fb835bd59daa5e0db5e18932cb6b5692f09d2dc461887e11b80a0fd63c092ce53c709ba030d5c15fae7cb1582a50ffd1dffce5dd765974d3cb7877c1a5e37cf0119464e16618c51d42ad0ac1febee94fc0aa080dfeb308c9194e1c214ebe78b77e3a1d8a5cced4b0cdd8aa63681bf2717ef4b4d47cd7f7cdf70b96fb3532f406cb442626c358f1e79c25a420728f5e25f5fc364e25962cc5a05e6c824e2222017ac433e22ae073a1298b6d09be905d8d9b7cf5846622acd5a1385b87b8429329bfd07a7316c41dee983777215f36cd72f0d78f9672a37048a4269d45704754f62041255ae12338401726695d414994057a053658f4a0ffab654d1f94baddd1760f1d49169ec311050ece99979466313557a72d1974bf3b7776ceafa1287bdb71d8c8def714406d1e44cacd9dd7b09005e305e842aa1d69ed8482642f109255c57fe2bcf5b3867d5d8865502ca85f760b39fdee2904fc9313d5b29d6fdca4f81d4beb9b16d7445ba1f7c50928c6a74f93c7414cf852bcaae570c39f52ea697a042a5a5f0164c7f881a8ded8d3a596f6b83bb92c5f30aa46e003d66e81eda02f7175550c7a40147624ab1ffeaf849f35202b11358bae092a628a6b314335c5dab2afe351c65a97eec27063a02d3a75f53771968da11c7dae67094b69e1ebb7385f7a327108ef0199b22f39f389298ba326f42c3634fe0def18462cd3c85436d2d0bbfbe27219361769833ec55a4b01e1cbe0094bdf5674adad76c583ddba6044e55bb975a6cae82f75d3803047b2f27d589feb7e65a32a95b058ba48d1dbd777d41e5692e931f97377d20837ca29fd68769d5b81a65264dbf5f2000ee810224454eeeec3cd4723ad6257112d718db6d6b17d8e86920d3ea390cde13d3b05758f8a535f52eaa5591fc4be0f7edafa9324e6296ecb0d96f619d4081fba4135f3b3692318235024a8b400acee866b48f6ac7fdb0f4b12840af9fcfde231a57385600f669d8cd50d95317fce9d1d4bc7c72fe659fe5835aabd61368fb45ada68c9d5042f35f229bc2c236a8b5e9c6f4417cc04bb04482c01e3dc3214bb8f55b88810f8f24d2b55c9aa33becd828274a8b861860941f58e0381313f91c76b045fb0f2a380ed13eeea15a7e157d0cd331cbfd737790ed6cdbf98433b0bd1145a22b189fd40a626ee924ffbe31c09786260626ae878505c4e313b5977d167e5a8752fc9625a3000f3bfce0723ee5a899945fb6df7e40ca5e13f4963066bb496ee4f8dcd3674cc8ce5bccf7f4723215a6410b2c1115f62403456fced55d83bb9de6aa54995713a4491b908fa27872110ffc3864a70e8c0ddf203537e857b3a17dff96fa285efd628aea4c29258150fc7b0912afb38a09f24e82d05a295667c3f8e84410b52b088060fd14738f387bf60b660947e448c645dd2aff35079fbc8a857bd6de36add2e71792e0b6b4cff1024a96dc6723362ddf4698af6c93cd7cfcebf940b2cdc2da2b1538fe9da070f4cd2ed9b5b5ba2e98ae1d0981d7b75d895b6b273c9426618bb0957f5bb96414b8214f68e1caf78cca3a861cb845e956ac9a71e9642fcbfdb345d607e46b3b01a8247c70ca5895f66cf33e4dbb54139b76f28a5facd00a6f7f5996e79c5079fe5af19804b149843cc9b89b3ede6ba412d1ea4443799594f9a3a740ab3a93cea0fd708c057346455114afbf9b6d50cb14ee4f0d52aa1c38bd0ffa15f7cbc4026e897dd662780117d32f4eb6188a9fc8aba6d2c6675257447f4dbbd3d49d531cbdc8f8cb3dee13bf9fe4002f3c1e5612e4d928be97b0fb2331172c9108274ec7749f5fe95206438401641d19e9175a9eda99ee2c0bc40f9f8ac898f190b4dffd66538af23fbd95fedd9412b7ebc5b52eb958d3cd04e6d388574aa52dd6a9df9c48634f2ea26d18e50b1fe3d3851a19ef5b12041575490eab593f5b9527830c55f9b62195b8d7efb0e12596ad678750d9020bc9c31b33ec992f8697ab5a5df7e7d9d55717d79ae02043d5c14b67319944678c84f2cceac212aa645ebae9232d3eb3cbd004506fd8248b932b5026bff336be18abae5a2239628713bc3d8ecddc33981c06d680766af5d5d5ee697744a0e16bbd774780e1f1fd7d031626b8fd11f25f9e5db8fe5f0842384c9cfef74d43106ed1a8742fae2a3f61b2d64fc3b9950e3ec5c7382a9203332301adc939abc5fa7f3d0ca4e90619bfbe07bb2c82feaebe6764c315b6d607b2baa81bd147f64278e5911ce678049629cf87af480218968cb50f66ea23d29d372754297ecf022f008621b5382b27b33c4019200b1e36d74dc7f778c8085377e4533ce97d7b00e77cbea409aa16dcb655275f50c689965eea5bc818c09e13eb7589fa1f4dabefcdc5f7917b8d7f12d1115e8d89eaaa206da98984174e7102d6342fdbfa16caa790864a3e43e85bc344f7cf5363eb92f32d2ea908245b381965a1d29fe5946b744ce5ba2b051bbb600ddfb90db434f5922f94eddc6078ae34960abbf7e849bb25dfd5d342eba2e2cbaf8664d72629d0ab8b23b8389377db98accd147896b2eaaf9512905f1458d071639bc71fb659ff5364c929f112739986f1a0bbabf3c2615c0a650000207eaa1956bab4971eafe5054fb1f943fd38c72f46b2b7fea1e3994a671600d99edbf9d219312a3c7ed299ea8413a99ffa368f3fb8c8a2d12fd113b53c3e0514505388ce319d312e55edd2d6e040f7d2c59871df897f1b2073cf60f1f71f2a65e6e5987ee9e0439bd7f7139eb4e19db4250efd8074032fd07b7678ae55cc7f8b2b29520c43552aa854fa1606ea580384ecc6d6aaad87afc8c0622160153e4bcd831f4840ac2079a3df69bf51271a5a548e3682e2d541f08adb43833cd106caf8067e5659c4daa70400c9f2d9ec9e6a51b7e69f23a8ac1653e6e7dde2fbac6bff378d8860e8e56f401a726bd3fae585acfa96401f9b69ab39f72fac2d2243081ef76d2e027990b71c0f2545fe900664bed37fc298080a7ab9ea75197e777031129bc34675075762efa3db1076280f3e2822ac29cb9e9267e6d6d4e1d1bbf38541f662b12500e3364a325f956bef6ca309e1bfa588ae41f97a1019b549711ee84eeb9afd46d267641efa66a0d89b9ec6494463012bc84eaae271226be5562f9d46b4c8bc3906778c807e9cae4fc54a2065698e8683c3465bf78a04508920ca8bc1cba22be303d43125f856495314a7ff7ce9aea8228df74782cd68a9898cca4ef48edebd0236f51544c9afdf628257428f9ee155b1371e733ed4b747dd9ebd49fb89e284f62ec2b42843f8d400184c5d6937695334c6594a47ff5dfe64f2a65d3bbcad94e012fe60069b0beb9e8a0615edd14c0e768e31fe366ebefc232277a9e221fdc004b5f851f4403cd7c7b3b50ac4ed827bdae7b4fe98df639d6ed48ba2beabebb21d9019945494c196b6374d0bf6101ccb2bdf2ba347cf68df4d39a15dd1a4ed7912fd6c90f167602f6e49f0093ff402ef740d9217e8c3e67a47129505fb995bf3e98230ff3f811d1d9910e426369f83a6f40e4b9b8f590568989c23b02ff5530d786eb784aef72d1ebb421db5804d724d2e249bcbbac0293f4c7228b6e9c44ee052e60dbea57ec6d768fc2e9dda9401ce6fc536730db3cf97362a043e5f01742d848f1770e99c58972d29908d2ccbc7df17ea87aa56657f7c6dec3438607a9fdaf3a9225971c5fb0da23e82abf55c35680072aaaf3a14b091d02086b2c04f480d2fc9d2f3be79a1740eadd9a07bc2ea4acc85f4a4b1b42bca0c1b4b77bd2b0451e248402800917bfcc77ceeee86e20b14a74ffc35a6ec498f22eadff6da85ca70176465729a4948fd9879f7e1ebaa411b77d006dacc09441f2c9bb8c30bfa909c0cf0b5568f74c3d598debb5c6cb8879a706405c2f86c223cf983593b030480e42235308132d397c2726193a3d7efb0790f44d8c1847590cd172ca7d885a23b363de2ab59c3aa920ba608926832dd60fe2d1df44bcd78fdc2983e9f740412df4b0a4d74462d601842cb6404f3458f2522e03a979aabbdea126639a8f98239df7e884ecdb5a01b30abdc9421b5a5d009e023015770c6214aade48b2dda2d878bf106e4a8c97471f25e9acde431a13cd712abc009af8ba45f6d0341ff8b3b2101568ed622e699dfb75d5e6e522edd5563f00344deb3d32f048c58c5701aca4bb1423e1aa1cd0f919a4decc29cf640ccb22d3fcb569522fcb72c214e80d63f030f1b99c5a24da9f7e44b40902814fb0fb9bbc446f4cee1c856a3f55eaf4dbe34c42cf6b984157c5b49ca4dc6e343be902536781531df4e1f38fe888e40a4f4f3adcb255223ffc79e5c1ec94ae66068e947187c6733b546731855f995d8f310318828589dfedcf847341514dc93f74d2f79155e5904ac0287fe7627935f5cb22c203caace26a553ac30003a9a06461f4809f2e0b87002e522b39d81d28de9006e3e7b4dfbb04bd1a23aa0da4de828992b86b5c1b4a6841ac7db6e987fc2b060ee7a7af040bd627a08c21e14c89e250c21dc980309fc35b96245f859160cd64e385aed1c9eb52b20dd68d1a57a716d6d4633e4e982efd830c490caa170dbc10e6937145ebffe8d27cd2208d6e168824eda9969900e822f406965fc89386a89691af69f50126a456d96fe3e66b5ecc8f9c808fd9f0737d5c6080e9a0425c33c60fbfbb24cc56ed0cbe5c7311c979225647b8e6342fa755d141c54d5c2f09e6045dd8a824d6bc0fd17a8fafdb7ceecaff6314ad3bf85e967a374d91dee2335c5a73389da95160e7b1932888f7034bd2812973327495a6546f5ea8bd0a5412b769614b94fa8f0458d2abc399ba8f45902a7532172cddc593b58588436ad81f6bcdaa5ffb29475c5383268ac64b85e8c1a0008d93cff7d3197dd0f0cb093c680f0f5634643f4f0eac058c4d34e80c32e961f6c006b43233a294a860f2bdaf82ee394176224bba9b5c5c8bb0cc8ffdaaca9da1670d0e49b3e3edee823e26c579ff03e5d1242df153e43a8e6c291ffbddc6715acb5b3672e6485df3de23d2cb36cc450bb4730f1a89a81bc1dac5ef3ddf0471c9045e82b3c2044e8f24cedf1c999d88664204c609201d473d20fc3ce5876f2db5f3bb3fca41c38ad68b69f190fe7ef7de2a6c53020c7bac71cb870221f289ad516d77fd0ce077ad42501bc443a270b291489da9b64843bc78bf4f1fa96ca7bf0e95a5f65de1b00c693ff67e650d121646f365286585ee98181abcce20af4ae487384c90ff902b1cc47529de041b3db0cb51522e4f688d536a1e528b5cc375a550872b26697e5df33a73d3f8eb5b16a6c87eda2c64dac9926e74afcae77401f84d8dea09285e07e13ff9fb1ae28ebafa70d6921db110e8d8a787843ba4d4e1372be2b2e1aa58a71bfe4278b0e29940b729f86b44808194c7a525898da8c76898e9355a9ec14674590176c81ea5f0405aa20cb1f18e4697b8ffc5ed3fb1a9ab9034fe40407ffc7941e8b2e0cc044e1a0ad7067330a61a38f9caf627e606779fbe0f589dbe2f54414b8685807b90daca7b950cd065136214f2b7fa75361f7708c5d8739361784eb82a0f0693d933ff54721e3b0e1597e28d51654515a33bbe6e8a84225c1132aabec31313523d0bbfe3f562d0566d421790c3f844b40f769f425eac3864fc02d957204422efbd0b55f3b434e9b309a59d4a12efc1db385345aa37dcfd72c733847c151c5ce9bb8a16bc321919cfc1377d84f5adc62747b6c95e6f51ca8e9ad72ad46902b672c21309b25f838d5f94759fc68dea26160088b30534736de2c3e754b405c3da3cec5b20c22102c004c8a900965bbec57a47935c02326390c78bb286c3fe2078720d66c9940ef529b1179e1de7b8d55a3c9b9d9e1b3ff547aad7960f9e6c4fb46315394e920dbc25a2d5055cb1731dc63b2d63f3f25b2cedd0829b336a5b5b60d8cc35dc8f2983a5e90065216f2d51566953ac4420771864e074380f6a3825606e969f4d4dc10a16c62fde860b4f4f9e4711907fca4089f5aa681a5afd1412e918b1bc4ebb66b88b1959ac3cb3c1cedf66456516d4ab92a3edc0ab4ca3dad1ae80e7dd6a778550c42dae12c0e794ba532ba4fad2fd4cd934b1ed752c52e4623656ec4e8934fb6ed08a9c9ee4695eb601ad80d39ac070daa4f0b8abf74c5a4368e2dfda1ed9623e4e3ed5093d0005c76eea661b2da52f54f6463ae4b39dd328f8b07752508db544cbec37e6ff3610bf468b29b3a9f4389077d9c37da503054a63036f0b02b1c2908a59bbe9ad79a41f63e72c07baed5b7a2f51a7f4c5d3178bb9ca35670dcd9379460bfe5250c66ccd588b7028757698d6037de201bea256bbb9a8d31370d091b2e5d5e48806137f3a08c8c3c57442cdfdad3a94a605a5c426329566da1b8c05cbed86242f717af907bd6ef97d1e04956cc1e0434a2e778fc254754cc82197b66fa2eec56edd117632a7e1a7517ee35d0d4324da4b20729135c15499d731c340f6d44298cc083f6a7378a8f685f60bc81ebf4f53771c134212b64f2dea53de188ad217ed041f747ed53176257d42f9b95f822bfa93ef4e09a1e8c1527cc9e249314fd3acf59f5d3a29d3fd8267edcaf4376a5a45351e74b411dbd952bb78af8cd918009eb2eff79c9b435574e6506e8eed8d4658300469a72cc5c99368bc93200d022dcf24feb56345b5dce49f6f969b5489d9fe3c3af1aa8b47db42158fe044053d9f97473fdf025edc3443f456e34e01ed73ae8efe049aba28874e4774871b8083daf6821ece9b801754fed21e5231774105162759b4400724b53c701eab1aaab0622fad4e964fa50ef4ce203d10e6e0242dd4af64e60120eea1204aebfa235936f7b5f7476dff2cc1cb4b26283d07fde40be2f6a37f5af2c2e697d7dad6df90f0165a89f56289be2418fb5079fad4a5bab8af936d4a70a9bdece36a3acf48f3d79fb118509a242eaa5ae34156114642da87b4ed39d60c29d7adfbf5c231cf553ecd8879c5e946711df229fe9840174d0e5e9df5993e0164bfee8e44854f1ac19ad67fa04bd05f72581d33eec2042bbf30db39bb53dfce611c1d5808e10457fc2a95af8ae741853a0aaafa2e128d6fcfe3433d23d17d8fb272abfd819c1f296975a921f164693b3fc95104d63e9d3ff397bf69b530cf81f3bd3dbd8d201eccdb47ff27d384b3e53be17c52b7f2afb627cd937d2f5c5868e64d58c499ef016ac03ea61f7fe4ffb6d06597b2d875f74ac2b40b3f847da3a556ebf806a57886c99e775ac19d3973c64b352a5e3be394ff06986588b4497f967d2e07c37616d4bd28f146d8a10c7ae1bbaa8669021fa7ebd6808bbcb18f27ea768a0003f0d3d997f703f5ed492d7b047f5feff5f43e2a96f9f703416b414f671ba53b410e8804ddcded43f342dfdf26ff91fffc7f9e5390ccdd75092261f03cb0951fc68592fc2cb2f5dd4439f5654f35af7279006e9847c759b82c949b3824e35f621edd737d4228482089ca7e43e9915196cc05e2a1959dbdca5b4839f99896801c0bd470ecbb24af9cf9bc61c0117eb785b9d90310f369dc94e079911371357855d3e5166902128e6cfef692e71fc0b6f7d7d3d07d5f84ab893a49a15b85e7e58d13c30f7476547e93a1f924e0e03a1dd98b4d998e882d2d67852f04d26f653a6cb8a0bbd38c87e4d44e2dee12bba11e3b443a171fbc6c55680d318f4c8c4205a5b95f91041e34d7af5c7858d0b024ba39087b46dfd6741b8cc5a069850ec593bc93490743a7afc3a70dd19418d74d10b32afc987bb57b2f1cab9cab9cb9dc636db34a5a0b280f3a971a2fb3baadf3450c3501766dd036b2d3d6fb94e554f66ce5db969cc006b85647c1fb3f89a68733a273a8799a799e2bb1aa524edda72a96c0efdea9c015a69acc5042258ece65a3d16c4159d16637160350b2d71bbe4e27d8ac6535f76ab2bc591dbc99411ccca72086312db180a6973326908a403fdf2ec86caabfb88e22095e5cd99b2f0f8c415d3be20aac85afaa2f26510bddaa9ca825ea34be00ebc8e3164e605e56845491703b3c7b1c665e797f847213f695e8f85c40065e066d3abc0c7aac35fff559cd51997114c5d76765402450719906f9e427e5f5e2d75ee92c5374ea4d67dbe182ceb0253e12437258ae29a4214267d54c3fd518e9954b2736c9b25dd4ddacc7c4ea68d97e3a6bb2a26c75bcd13b38dbbeb57dc9d20de054bd65363e2209914900e64249b6cdd3a66afecfcd19700c0dfeb0971477fbec33257f8b4f41e63cd775c2cbe6dc10080168d2d7400860c8182f99f7fdd573b069968600ff949233b3bc4e20ec3b19a631daf9c6564c586ce8289b5829a51ad92080b978de81412c2f2a9e8fa06de75b32a575ad0a0f2d142a541f73fe3db277830899102c03dbd0d03376f091170a28c586ba22aa35a4eb63675022305efe6e2710311f4742ee0bc603dfba3330cbf02c3985b1544dec30363532494bd0eb7571604226481b82e9e609c79c5d64cfaea8e51c91d112207d80edb7b8bb68c061c2505b03c5967f6d2159e95260dc0a280ef024a6a620157a846376834424dc829a3da6235cf7eafa4bcea56ed48fb42cae5cfe65b7234d80214366f0fb07cfc2bbcece1fa9cc46fb00343c47f1584576c8c6f95f7911feb645067446c729a6f8cabe82a67cc551994c77f23f1a54cf9f447991bc44a3d039b4c3722c285029f16068f4ffe40b0c55136b5c47195732218860659bcf4581bda65bb8b1993f0f1ec3f70f03909ff9633a37be6b7b7379da8534da450ec5b4200fca8b39f1f030c6c8ec0623dd24e6d8d3650d73102be9bbb55b3d9cf6ad58747706ce160ece65feddba3c1c1ba96eb4dc2d914aef5479645248411353cdf2e326c1425708e54fb4419956c2583a87f225f971b21374dd1554ac39dcc57d91a61edbeb909950b4a289b7e9220cdce69c70c643638260f5ced6ffb202aa7aa5a547952d83129385ee5103ec2a61b977fd19068d9d7aa2f39dc11d028245ed616555289b88866361fea4f4661aad7a4078daf4e02134bb97e6bff75ca63249937ec860dd8ab6362818aa3ec00f75318d626841e81bc51d04e3102e0e1fe342c5d3aba9406cbaf33f4aa2d2536a1a6c0a25415bfb3c20de50c43cf3a83577015c9732fc0ee3994370e9f2a03304f371331a5abb8143b8736f373deeb84091bb64f9f44b69101e8cf5d7a738bd071b90fd203cfb3e31661db47c60d6361b5341f0b55530799a433a266dda614c6a5781535c766a3896af73d9607971a721517704cbd19018531007384c7124cb49d7edddb500d3024d20d20f1f1ed75e009d011cb2408fbe537b0cb865e46b0d4878f930d5a48cc1bfcd77d2379cc9530540ed64c472f9eb5cf25deca5476f0f5ddbf011460c68e85f74bd79c58dc2d003b1ca831c93f0601d1d94096809c5959151a0f9034563ae38b21809735bc190fd065032c6e8d4dd749c32e1bb2746e4a9ab5a8ac4de8074dd17832f75540ea547af3e9c204280d88e781179484f5b4442685c1915b0f58c98e99db264ced3b8a4713538efb898122db62d9a43e81047751b097ed67c962467005e113e317db9a806402c1305578b9cd5f8f1b59520f77f73accbabf90fe677fe4b1123c522f7098fe5cd1623ecd1ebeb28cdad88538776bc949bb65773384e9b4d3e2a9b0b3ddc1b2c7fd5853def23183b1a8e64d1e5cdf54a502decb61602786fc8744f571f8ab9d6cd5561ce1604129048374ee93bba6a004df8e8672787faaa755352c24be7f3b5dbbe8fbbdd4bcde8f0baa8ae7a5ddcf72a23bacff95d4ccf0c3867b3e5c46be005e8a889a163a80e8aaa7911096760d64b1f7a149925553df45e6d000e94043749969add43e843991c2d53c07bac37f076f5e101e2b3bcc137ed7a1b8b1a9f51bab1a10ce0a43139a2aad46a48e03d3a6af58641a64f358bbb711d107e1a4e2f01600efd06f89f9e41df9a50c15217803a229696e39ffc099eb038608b5126cc8703354696fa84dd07524bf53de1dda60f3fec3bf6457c56a64c2a6ef7ca7be1b8e8c77a4d21cfa7a81ebed28ff917a0544f86fcefb4999ae2243078314b05100eb098d41b86c368ce2baab9eea42480f888383a502d07919c72737fd9c191aa6c46a398e5b9c528d50bb473217120c5cdf533910a99ba382d28ed7870a8f80b11a3fd37041f69fdd63f15e05c060b18e7c036eca3cc3c1fac247d52e122e2c4a065c6a89c28aa069771a0acebffc702778179b3ec74c2fa2279cec5aa4168c12940d3c142f6bba7e8a45263100911cdd9936c9626ea4615ab8980dac225f80b48e3a202738ca86cad83db659899d4857600e287235b652bb31edba53693b7e1a4ba1e93b75987a01a058ddcc6b8569d6a0edc64a6e1689a68a4098d08f95839c866cda8f9893dccac84180e51aaf12ca884027174dff3310a58eaafdc88bcb114a9b05a26f19c47cc5119057a65d8ed73ff72e6a88672f1f1298e7c14151639bb9852a19a00e96fb05ef4d365fcffa70b458496fdffef2a76a4ddc9a222c1f5f5a433504842f594af73f1ceeb66087b7aead8c0a17729652b9a17aaff988cec3c41e3ebc5328eeec7175d99d6bf042dc447ba80ce5aebfeb4674ae54eb2200d28cd37fb66d31d749944afdf66a822d77b30cdc68a946e8fb39b5a7c584634a6de4fc00d7b0c9a1b37f0911119fc7e92c36b8cd7455c0e378a896f8a977d642347709b69aeae533714e8e3a6352dd3aaebda105a633ca39d9f867d137dade15aa31c50431ab2237e9abdfe2ffbf378a6ecfaf22f756b790325eb547d4e142a0dfd380df050f487579394ffd42c13f4b0b5b23d9ef3ade464f3b440d3d01621020d1643345150bcac9e64e658738641837565da92ec08956010b057f3f7bef99534153b5419f44c1b96f215d51e10a7e1ba3a8d13cc6f465b1dfdcb467b00612ac4ab9086a8b8eff01b095d071aac6897b5d7fe7505a75ab9bdc95acfa900fa427f681d11ac6233ae743828ad4b49518a1db16df91de52ee14aa72f0931b89cc52751ff68bb5c2ade87c5ee3970ee7af3cad3d6b9c1cd534bb8de21690e4379390ce44048ca74d3b8b00abf5b238309fceeff92c0f259eb4ce54ec70cd51964fe3dd9ca7e4763f291718c10ad8a53e85b27270ce353ff3cf21f701f65db88dfc2fab7cd05ba6807bed269d22371e19b7616551ade34614a04d926e183d002fbd4edf304efa150f3bd29dc64c7e48b9bb2ae6cd0e08e817a1e800736bd79ccf4b3623326206dcc7958cfdb41b33437260f05927006d3db91541a7d370a37f7d5f40c78d36810307304b513da3ab9e7536f30c18b9d33e1c7958c14749f35b91ae02134d35eec8b6f0d583f07f296ecf962d418ba32c52b586d45dd7a802bc0cd1fc4cedf3490beb53fba07ad4a11a09cb3debd116d6080ee6f2947ae99ff01011bc80ba442d72fb6440d9bdc374daa80c1b256cbb6a28b93b66e15ea43774005767c7a93631d23bc88da54ec7d9718517cd2cd450ec8f680975afaa3c64c0d7a2517ca5f76681366f5c7feaddf44a5f5511f372fa3345ada136c5a7418acc5dd35137f00856861808d642e862a15023dba7986144b5ddca5c04eb8a896f2d9372754a34086cba18392b0c1e524fc991e7c5ca3ff1275fcb360b043dce6596100eb7d55e1776da3853a17eb042fae6e943bfafa1b2d3ddd6bd4d7d728c3b909d5302f6ba66ea93ecbdd6013fece3a4c9e45f0019ab6639736afed7ef8ea36716ee733d553c0cef302b5a971395f1cbba5b08eb01c37ee1bd1f17aec8401daf6285d1931945bea23acf519b6d3048322098bbe3b869fe4e4c155ba25262440de58ada6b49ae739acd595faaf2a74abd18ab5d7af333fbdeb3b8d518fde70b2861e73ec0a0751931dd36f0c798316d2c354ff9605e9f7e460e336fdc69da552a6400376b8e4bf6bb2f798c870703e4b5ebdfced3b4b0b407468a8fc8af089136ab35eb220efea1fc7d390ebbc1903128a7d9b63774a7d127c662520e4ec40494c797cd30b3c24251be19c4e60dba90cd13cdfa48e6eca37dd445dce05bb7fd63d059a0814e095cc1cf9d5a6c197aa650729869db02b49b95b68773a12c42fc79696325075094524b453aaa2c0c16c5e9fc51efdf8edb1ff2f4856b88771a430b600d44b775f2d0296887e6b5f4df8e04ef732166c70689881a2adf12b375412e908991ad6d37f4fdb17accbfa7e3c7df195e937f9e47762aaf8fe0f536eb3544df98fb0b682dedffc8d7dc9072b7605bc75fca8b9c954e8c188fa2f3cd86fce0b9a697ab27de456f2c8f3c65fdef51cf8ffa770dc21e19581393c29ca0b858b9ed996dde532968206db4b227984f2f11c940a156161d1b2d512be8778d8f9fa8836a00ffbf35dd71ad4efcdc64d57e1f744b637e3b7b08583164e01f31c27d1ccc1ad70e86f204988993f3425be629ecc610ee535f440b08ec9f8038f3eefc34fb065d9fd12c08f031e341af682c1580520ff05b49841694d39429028a6c2f5a2d4bbc3a620dde6d0ce5cbcf9cfcd4a550cc1bf44d0f7ceee25141e8feeda188b86762eee964fbcf50ad4d5622d877f5397d6a25fca3f8a3ab7723fcf7edfaa86dc71d4ac2201474b0f249ab4b31012095f27d7d6363d660922a14909597d249c365e95ed77438ca3ea13cf109066eb76fde1b2bea778a5246e029bd32386cfec2eb362997651e689aa207dc36f571292430e0abd3f2b1d244d28aa19a0cf84f2696a6a0c65f3818f89ae66fc48f663eb55eda670820921be22ffa4a7e5cb8096ea807eac1dcf73afe3db3a730ec2a930e44144c66e44e901eb390abf2e65733564ef18141962b3dbf8c66bc3823132a2ef4c004bdf0dff28d26ca0667af1e5b122f5dccaae9ecb1fe513162669c344eef99adaaf8a0573a46adaa28ba8aaa6e9f3fcf85b16e39eae7c929d220e7ac15f6cd2d5a722491d0750ea16fab91a53b7794a35696ea45f381c35f5646641b0130169d9a83b2dbe4c5b5143df9662e4c47d9dfdcc56cbf023e7c5da5e52280d6f2a8e36e6f6c004f01644fcff5b95c37e6adf48f65be2373a42ab5bf4c131115429f86d485a4c18edef8ee34d1b7ac010a75f15c29eb8f262cfba2a569639054155abf095ff14a7856fcc0334fb1ec2a2ff2d93f11f4d609b2b186a9c0a2517347b541e4a6a4dcf42038450ebbc2593b494956d53674668de79d6e65752de5a50bfc04915a379488122ca5e5f59ea52c3f74d0c26ce0eb14925990bcdcedea848e2babce74a4d11ccb833ee2d107a4d81923ba6517321fda74ad990a5e32810b658e728cc21728f4f0c214d6f31a7832e91ff864185ab691680684313578584e03d09ba4fb8c2c020127ffe96b8448c017feb4f2e1f2c53860ae7d03db3e1fb319fde3ff624d4e51275cf82af34883a05c514de2d811aeacf4c6533d7cbc62e7f523fd07d5cc5a929af3fdb525ba7b1429ef58c7209805aeab8e98b3eaf1be5dae5ed5597d338099aac40fa6afe52c7b3dc56544fa12097521de1be0e570db694867b8e94f97ece37a60eec22b4e49c50273d6f4a030f8845a34e7dbbb5e5ea38e8ca84e0541849c46b3f587021794313d91cbdc51171c8a4df7dc26501b048bcdcdc65afb02bba57fa240a714a1788213706559b6bd2ca4caf39ad371129fdccb138db7f57fd6bffe9fdc0fb0d7c67226d60564fbe0fd4ec5966175d35537e8a02d2716840292f36b3e07803f2fbfd4594c9a10d778b75d00ac694ab1c2a14d13d360310c6d012d12df561a7552d221d8f51b4a8371f4a852c8b355bcf1d2ef64efafdb55eccf6dc52ee1dec586a0125bff69da907daa87b3adf5fd2a70cab9245ff94b2c0e21f90df3060a4125068b7fefeeb4713ffffcf002cc723351c83bd00f2b2902eaec6787c86e2d81c127ef0d743136ffdb25d218b3b7fd915fc498b27ec4f11b0e90014ec0601dc261677056f992a82a45560efd54d7ab1eaf5952b2e9038616fde3ceca7285af60bdf4f0a8716aca274266f76f81777bc2135a29e96c2c1c77918f0ad8fac8d6605266cd36f6d1b2eb96e5e80a316eb34b8391959eba33ac3b7644c24a429def1a004e3c53f887a800e0d09bb54d08cafc611b24e5c649f9e2ba1cf0d372a383f6b19c272bf71a0dda00b17db10b9cb0055dcd679308fb79d2b0dda9a2130277944034f4177294822d928e611aa068b3d1e711e1aa1f2ba7cfc2b593252f6fd5cba75cfd72acc957e310fe3cfc9142d67c1070ae21525c73ee18d4917e6786b3a8d4a7e7e0307e0c98cab68b351bc77d8a93aa789c7dc994c564901a2c500605d807a2273a7232c8c7a597d9a1608309f6ba84e07199599df2eeb74de2030410b3269cce9ffa24000e065c7703c9f23bd6db46577a67f572f2aef44d9c9c4f578a506d9050434816f03bafe8349bd64b5525f873d128cef2e69b856f44c7ed016c8eadedd52f6ff8696d62eae662997eb2b6a2a09760c29e0bf3e24cf4238fdf79abbc582dad74605c0615bf29c19ac31d2bf928088e87d43cf17dfc20384c6a5431b6cda234345ed4b1cf17f2ed173b37127b639b6a3135ed7aa0f0ca2ae71b974e34c41f24fccdbe3ea80bc94fb99d4132ccc50d0f099e2a8c98014a432575d3fd105506c2fa90625850a3763ebda2e92fbf1f8287be04d1a792e3016b8ceb0b5fdc887fce1bbd79e7c6fc39fc6e3615366d4dc34e69d552ba31451fef3bbb0ca477ac0d43868a901a1e2c0497d2fa400c1dd9c95d34cc8bef1b4dd95a4e67b1bd9566d8293e0a0d1a3685e9c76e2ab690d6f493b420df32760dd44e490d15ebd90b4154920522b43141f20da4accc82a083a6711317d6313eab5633efe083e44f5f1960e178a610c504d961bd83eef15151356544e33474dfcf28d0f8337427a2ec972edc56b084679fcfbd674f924f69981d28edc5d479c90e32f102c6453468a43f1ee0f75eef63b8d7483354c9dbf2e15d0c668398aab004ca4deb597fb30be2d2b33307357b13170406220a55c6c893dd82610a0704e68b34a3a5e91643d97f2ab1feadcad76b22e796087c2b4fd7d48438d463e58eb16bf16b86a1d3cdf1ba24ccdc5bc9f62ddb717a627a79bd7136aa89b96cf219330010910fac41883deed0ae066de543988aae3378a76d6574c597651188c01904308b5ebea95db8a45c3568feed5f3314c12d6dbc90ff4c2f7ee62d62b74054ed5a4bc3ea6ff2a928f962e6bee4515ec567d9fd59b6110fb0dd2a210ac33c05df67f8747d75d4d281ffc98b0d00aa6754d1a2e2cd3d48d61cae572bea3655ae6bd2fbc7d86be1ee0f229497774cb64039715d41004e33ad9f9fcf921e0b5d5e300eb01d6d7dc13c4e5d29997ffe784ff0bac0be82581daa61a3e7bee8e6a4472876a7420e6968e2c8f55e4fc895f1cb667e309bc31dcba31eea47e3803e39d9065ce62ddc19ed2686b8739517b7979574d94d8fb6abf7a3647db17088acc02adb85eb63d71ddb7d6be9b14820bce3dfe47c61bfadb315e37d1ba2c6b20b21f477e10b6464e916d896ede5ae499a7b01fabcb374c3ecd3c2d2274bec1d8c8cb4d7832c17c9cb8f50cc256a43baada8e1f286530e414f3d97ba3ca8b4076a53bdd1d7f09f537df9188c61b0f36a3319ff246d426ad5bc8846f22b125efd864c08fb69372ac5e0a40c42185d85a8766f1a0de9776ec1cf25733a183f98315ace4b3b57ee3ddf450a5378df9bf4949680a624c60f9f16f13cf48688f24577d6d35e4b7977d7bc0af90780583799aacc290796a6140347242bbc7a4ca8fe1af4085f0e6117be3d7239253b2bb088f7df1108309480cb54c4e90813db6eaffb350c1a2ba0a6dbff8227be3d83baab227d00655d37630048e7c8890b2bdba139340d8f4562d963a0d083a6f2b6fe1a676d12f968e4c623c6f1687eaac7ce10c079708468539147ac4db483d01272e5493e40bdd09f4f8cf0163ff2739b7a2b2038eaf7302c16f887f80362ddccfa64763fc80c8fa9d8d94c6feb637a1876c3122d19bf0dc042ea7caf7d163074308dce93db7ccb537311d6a8510d3b56a1c40882307719693c1fbb56fc110bd4a97c6591ab17d32c7766f62b9c4b19cf26d3d4b3304021e44fc9c9d2fd69664f411002af5ef90129b4fd518ef70c54428e13d1cd2b52c2b09f8b1b43f461f03a5a9ac516fd82c5940415265a294136a20e654d656618a6bc9b0e586c3c95d518c380796ead0801a6f43c0dc341a79c97d646af77b32db0778f9691e141a34296426694f47fbf53d2ee3c328fc5ec87b97793cf68a46b8fb3ac6e9158c1bbaf90c6daef59349d20d54b470a854cf2b8b9426a52afcbbad54d4d03c9969fa76fda084180e14377103a4975074ca6ff957908130731fb4e25df3ec0af08bed18702c0bb46b90fc7b41ae1b04391a7ce753cf7a7ccb73d6a3d997b8507ebcd17e2fedcd0ff1b551019b1a6540d26ee68d0436bbe00136ff80fd05dc031e2fc496b7e4338cdb794c10b5f7df6bbe5a85476e550b8c179521ed42a9b0d2131ed6d46a3442f5061cd69c90f3604d5f5bab5f9e742424627eb4ff0c2e67e52f1a75a19ae5798b39af336ef85c72867bae891b40ba343eda75765d29b767d940761521ad129b8d42fe820906134b774d89b9c38b534324585d63d2848b8b37fd7d63fe4a0c35b2e921ae28342150a7eff7e0950a18927309f597ee5e66e88c196afac36204a1ba9c91fe209e678530559ee89dcf21c65008c01708d79ed7a746ed2aea169ded9f4f7996a2ab72c797c8a24ca20758379e69f82c26dd239479afc6eb5410bc5e2bc951dbd1abcfbb2ddf2676ee9f659c0b6b5af9850b60a115bb0b20f7aea07aa300feb099dc1451348be3237970e31a09a9cf9395d1ee1a0243536996a6acc5a3e9ba61ebfd1fbab13fc8d37788c5637e879f01fb2bab9f4df9e63247d68632d58b3a5bbcb8b4f825a4a7ddbd2b95036588bec72878c5e67cf21a72469875d809a090f860f5a1f0dd111876ba94a1305f331af81b4126cb0b12aff52cdca1c6708b58770e2758835262b278aa687933f45e05ca4bd8570dc06335c1514ba45182e9c62c6fc035e693ad88a034ea67377186ea4857e5e7d57c036f4c4023d49562c9ff44d36187f3a84e49c34a9a6713380326ddab6045ec271664cb3fa4cecef9f76d142186d76f29880f3a3c4e582e202c9be86925348295bb4061dee8dd743bd4c5328f35f0834f1842605e3f595db297586020c75004fad7373398260919f2da59d14babacdd9c5b19040d058f883c58944a036d514504acb78e8795ab6637a367be5023a8ba522ea8bfb602aa9b752def739a6f82667999f39bc63cc2a264e777cbe23ad9440d985ae785f675ff3b8ba7dde846bd241a54577bc302423c7c190203a77d37eb506841577bcf6a002cf772d1e19d09461f1984ef23bc1a8327b8f8e68922f9763a7d5e23c52a194e56062dc46a8d470c26e88fde5c940f26a9b1b8a4103ab83aabfb042160e19259228cc50dd2701a909b9d661511454beda349d0f2e4b0a19e0ed2bb79e207ef6789981d7eb8d98d4e71a57effdff3d2fdad0401d2a1e371c35bd7065ac7115fd1993c7e76785e08e3660be4e329377c836e4e8c4941d7a5e97c6bec7c29caf38c34bb774e2fe121ad235e9a76305fe8b8796c653864a7ff332c820959f6183b89319fcfdb7daacd0653d0aa7fa6d2a6515ffdc615f9a01a18a129f6543cf0e86cb8c1055cb551aba2d36fb1e897fea9ecf44f8058b761fecaa8a6854f56949e67002b837dfea8585ba39beb1c4c1cd8a7de1d9dba253261c4027c0cee8ee4749bcea6ad86c9a84ea7e874eddb7730b2cbcf56f8564172f499da3c5b57f16c58c0ebe6ac16f2d427606a085a7874d62a2d55cdbe4eae5be4e7b9f9b8e346747581d7e4a5dd7f2de45897c3c5237357eeb752404e61e7cbfbb706ecddaad6a9af867bfbd207f054603e2999f4b8a2912d5f2c7291f218dcd90db98cf2d6586071da1a57f4aa8fb41a54a054d023238f0cb6dc11adc1c2d50d91d7f9c64a5b7b27cd36912161c3434cb8b4c04f66061b2e5b84e8ce4233fa8ae244bf1c0116576b28ac534e862aa1cd260228d2deddfc3e90f96baf1fc9f2938d5b586ce613338d97995bb2c38c916a366c7f812862d5a90ccd58b8a891afa3ba6b973f9e31db9dddb3d1b6148757caa359a5107155b70e7c8766598ebb6ed67b214e069a81d4a51b020753f9af0c1b1d650660afa0c8e6c362bbbd090a662940d6394d98833c1f754eb6bd19a019c67cae446f28e3ea763453608ee007f71d6cfbd011da18d0ee1bc65ba47ed9d0e5a386d76c7533cac1c94a36c7d2f59f186a63b9f73f08efbe9439f13a019e740d4373a7690cd851daf447760eb4f8390faf7e8977794f2cadd149ef64837331e5edf7902af1578adb951dabf9f873b2d6fd90f976906f6814601fff66ccd3d86b84b7e88f5135ef81727f3de903f4819132b5ea6c85eddcfeca845aa9559bd41b119ef40b10fba49634aa804a9d84c9fe5997f60f95d37e2bef459ce610a3d5d57ce6eed2d7c963b8713244a2f7794ae34baa76f471f1920b59931b8bb98b523469d0794d37dafcceceaf109674d34f3c8b2c1a12eebda23a69badf199410e133b51c4a73dd855db96c6efefe1d7214d7b0b0b1aae5682e6900c371b9e08ece8994565d0b180ea23f607b5bc6a02ff439f3a3f8c741cd006da44efa855f505faaac38da14a5a46c632d3572280778db28e0a9bbb6508359824de2b5623ed0ab1490183aba2a14a52843c49a876ef732dc58ae92b86d2ddc9fe4236b4345ce277069bcad198d34fb79c51f2c1238dfe6aeba5ad8a5e7d488f3eab43b5b0ee0d4e5869978223e54c5acf4abae1e175ff813dffa619698f5854890e0ee485ddafedab54072f876b87b8cdb9da8260a4ae7027f5d25a9052b95787bcf7556851c810e7a30d74161c8e65d6e9621e780669f3581e94a068f27f2d3c4fba94e761b802faef345d41612035d64ef728809e39af8cce2a19a83d9bf0a84499aa2c3ae1af34aa7a2148f13c301aab4aa84efb4a2e6965089a0047d2650ba686e602f30afaef819b090017e05652c6457f5ee0dff12fb1c511a3171a7dd2765572c5f205c28ab55e104f28d68adc868e39f508a3377b64ff72e1990f42cd433a5fdc9e4a8e35de6091e39faefbf47905728e19b919cca0448acb48df567e456f71bfe27235a4f51466a893d7a6661c0ddcc1a1d58e04f0b1a015338f183b1284218df8ce31179f7a7f62390d0cefeb0d57796c19676ee135b2871106a0a5c4bfba842e9403d1fbaf28e38f0d7d3111dfb92c55724ae72063591c5dfdcc082a0cbabb99d0e615253baefbcdf444ce7d11681c2d26383b9f5c8815a4d63faf76a53304b8f76e1be4c1958ffd3c21e1361c405d98a1e449ae325355adcae0a9a84e5db351201379a775e033c9c3fb9757471a25689023b2c569dd10a57fb61476eb497140f20005ba57eaea7bba8837ae8642ef74fb2f4fcfccc3c5aadcf89991644ab005ea9ab3f99b260f0151340d4e2d1bbc46d42bb69b62337c5aecbde0748830cdc2e4c0c41f480db53a0bc5907cbacfb6ba264db18d3ec269ae0697b09ae8e11075260c93e49fb850ebd618701bd9d535b735848ad4abc3ac1790fee51cecc020fd8c75dd028aadf70c0bac12ef143b2004e9455766f6c6c3a3b45f5a1b66e903690e4be95ac7795990260638ea3959fa5e235545db5a7e7abe9cf06b6d58e8a6da2241cb7da0bb9747646961185ece4c0a450cf1c91c495d4b01cc7007a7cf2444ae43b984aaa067f75b25c6eff2ac4fc6ebab2393519a65d3ae3a56ee95e1b662cbd1132012c17c31ba8dcc92c9fd2087954a98d353c2c2cd94619ac7e87a5b24606ab16b16b40568a4e24cfe5e833cc40efcff9c4d55f3412fffa5ab2032092a2e6cd4983f58b472f1cfec468a5764314564257e66b80a899cbc795ec52b7e1d2f32754a7bada9b87b41cb6bf4144fd5d045ed79c89d7c6b921c04b2faccbfc2bcf8a7c1e4981b26488d2c53e25432fdb90ddfa075cd9bd3bc6d8914ff2f040636a3b4f1a0d0a6e43a2e75e0a256b8c4321cff4bb5cc3fa1ab54c012d4cc0288e88ba49d691cf0baeb9dabce4a70104b895e69ff6a06b50a1e7b5eca867318cf2a004c664f56b17c75224caa1061bf82cee9d230b7de0c62f25283802c53774df38f3ee855dd4b86239774b12a500264d8cbae68d6ed80d86a441aaa96e424f9b07e02805d94e829c4e6f337a0a7bcaffeaa0dad6e8cb0ed64b696e3095868d3794795047722587a8fd40bcb8c5388f13db55ba7695da712728cf8ea4b1a3b446fd04aab354e253be81d99bae6cdd15f54149ca7e9575c3397264a0a1914e5fd95f850f2d69ea65543d234e1439111b4686ada640477e3d43099ca9679626a59e77fa3303b4bfa8af76ae9d4aa677f3b203df032660de23717ada3bd5fdf86e2db7072a13801fc8e914044b2587225a8c0d379727c2557c1315cefe0795281b193ba2c2c671e01f9fcd737e0db872fe79af9cab925474e17c233984fe4575e159206331b1ab6840cf77fdd9b26bdda64f34aa8964c477530bbf32305a1ce99c23531a22f14d146bec1e295e04ab8d5c9159e5372bebca1d3a7660c169f842d9fdca00341474121ef4387a36fed41099dbf1888c924e21d07bbbb02e368714fae5eaa770ed0f95db5c2c33737d92f5d64c061f08fe3515d7aaf9b41d4e2135c0a6aad0248372cff5a0eca67a53828a631829a57f47526ddf1023749684d2f0c43bb449db5a8cc2f58555864041a575a269ba7808f24e7cadc066586a3c1a2bd6f942ca35cdf30944a96d814b05ff9ebc9c32a7dcad58907465256f5801d861910a52a1e40309cae58f3cea1288e292bec34143abce56a520114a0546d7a28098dfba5d44976be3bfa331d429b1829af62a4e9419050436775bf24542497cdfb17228d8bffd8f190f136da2b033917a41f71f608e3a311d76c57449343e4338d15b198008122c3d3cb72550bf01d1e48492f564fb1d3a6f0e8f2d59e105ca058415e32af927e79aadc6b995be2d10272a4e6cbb1e0ef2cdb284e9083af8d8d9c1a0d6a5fa52ad1724a26613299f06285d3c84c22abc82b94c0205505075a0981fe3392c62fe0d40fef9fa79d9e9d462c5bf72f0564c64138621227684a040bcce5b80e57cd4f1407b0d23b46b5028f02db5f917067157cb95524025fa2770a1d6694ae3834de5baba4b62864b13ea52e21e8b08c6ab1b9aa659293d6f67a8a210ecbcd43f1c72f56253cadaf0e24d2d430bd9e4c42ab8d75db4ba2ecf84acdf5f0b5e83c8600e05062d2b0b80929e85dd72deb47b53328a2af6b96179b5907b68929ee5c4db18af2bd130b5939e6572cc78e9d225ce5a429678294db33162803bb5274edeeeae9c8d953e188d6aa98b3a52656d81b278e6367ac9beb318a02995f87e524f62baf2cd22dff883bf50e9832524c212383e87df0ff04531f50a26b2e423dc386d32196537e1cbcbcc0ac33cce895f2d5d9de4603e2d6c5d3791d8ebcb4ff29b727edf7a032a3c8a4bb1d1af75ee73570d879f722925ff01670dc61e6fa564951cd3b46434703d4a140aae98c32d907845aff4aa0c512e78b77dd0d8a5f42152465ef5ce7e269c1b088f3437817559e4b88d809844332ad58c8322f922d7443464a584acc8f496d9b207a573e6d1557b5121d80d3f8d763fc8bca1a1850e581ad01945741c9f5b2ffd701d6aef071060f9567de8c99017192f0d6019763e9f73c87fb16c679953642cac37d4bc4489e0acdb550a4fa3342544a62d2f15089b2bd0c8ef3d0ffcd3dd3b816eb964a73626702c8150f9fab882f6ec5ead558f7eeae17df20891e9a11defcaebfcafaf5a16f02449f4db21f0465c3c2c79bde617e8e5490128fa5ed3454fc848930bc3108801b3315b6940155165a2fc353132ee27782abef50f26729401900d5295cd7ba0a8b055533682f072fe41d425fc75908fd6406bddfb7cc4bc5bbb2eb1efe07ba059313f78a60028052713929d8fabc224f2cb9d2dce221af44aec58725d826e68530c57a19e3ea5722f037890ae3322681b27f2daf6777aca97f4ac22748b4b7f5588d97fef3c0521621bba752851b7ab033809348f5b5fb15aadaa5cbf79f949328aa815c14d30bb523f90ccb1f661d130a898194c7eb7278f796cd9fbfec2e0a04d863f7013e1fe43d6075f34843a81313220a309539500486942dda726b639bce7eeccf518296bef692657a0934e0009694119092df437133b4932d6e3cec715caf944a3d6f05376c6c4f7fcea2b04b3730783e5e8494c8d693a31868ca857ceb6241c930e485c2f401d10cf05cfbdbea7b23fd9dd423e5f54bad33f7af9cf04af720e6c24ca398a02125a516b0a0fbb354b45582638d4b7375995a01dc670b6f765abc0e9b28684938eedcfb670f969900aa4cdd0849030b07bbb4551e4caa31ed75d22c79e2870655136b903ae111fff834f9b6d44d52ecfd8b0daa0d10fb6bc08b0b65311e0cdc159da4ea0a238c713a0e6bfaf900389f694577e467f69a7d8f69c3ffb5ed9ed6881ee646ed1f7e367fb4159b0f9ec7913a8dad6654424c863db9b129905559212bad7a5bc438c7c3235a0ac81a84f00b547430c28f1e0dee2519ef698a70d54ff62151edac02a1ebd473bd55bd9d23f7345a45b537b5fb41a06e856b203638662e6281881cb67c8a2e467eee14a39a8949326c6e78256d6aefc9aeed3b026b4a5eb5830afc65caada79c165d60d7c8b7a8d7191f8697a02546900d2c4501235ce5ff5f3efc3187702dcc4e7c2e356f5c4a556c13234c39c6cdb75314b065b882ebabc42f0b579bdde85ab85c2c09888f35a056a7f1e49c20af19da03a939821a6e89c952e0d738fa8da5f3c0e9c918a92fec9832be85db37fc3a10034a4b0de030a71ea5774f771f58dec40364ce14a2de5f1b88316b3b5131c7674cc52925fada3dae3ff74e70019f7c14fd908605ef140d7b4263a3a0ac5897041d433cf27620681fcd86a1be4e567d8f5722fbf3126aa1626fa303dc2437fa718d082d690305ed327355abeb46307cc5fee5295dfefe6c461a69a2c809229b40f32b42973af54d7aad38b086e408b8496799d6e8d74c13c03717a66f59626592fada391735472f6975ac56475bba9500a708db8b3bcaca4ac774fe4327a192dd24eb89d57fc1e978ac8cef6c2b218a7f017ae72ef1d28d3598fc6c85accb3b3c0f8464f51a20b9989bd1a331fa15219dfff24efb8d140c519299794a597d8c17ac810370ed295ac320c099ec93b00f346a961d71810a075fc635d7f0029d09267a091f6261045696ca02a65e127e5c6af7c43e7e9e137985a1395929a94642081985f943f3278ff36ff5cb7dc592ff3a647f09cbc76e16fb246a95d5418c8f51a804360739f5a08c3f6d21e8d452e5bf3ff10742763f3d71e7edd97e87b1f67073363caf61c9ad2d2e1c7c74b76e76030e39d61511c7a5b3c9b3809a33a92e94c661fd157f5906a4e4d1037e813d90145e68d3e02a7ae5ad66139d74a0a913bcec82d7a2bbc5ef68abfde4ae81ff5bf3a07608c082ec077a9b0be841e1b5c1deaae95ccb605f8888384edbd048519d1c625be403773d81520c1a9e2b8b769b1b84c0627850260dd93689b6eeb5e628e9e1f55b94e1000d110b65eb830d7afdfd5f203c61bb013e2646d95e2970dbad8661b007409f974404e5d5549e62b54b1b7510e6b37cdc0dd8c44caa18e9284c956d53cfdf7ba22702885bbf56f5520377e0eb594c65e97db94e0541556cf88c10a066ee5c9cbef31a862e5b26082fd0139743b38a7650cdced9f5c195d0a97cbfe11cc193ca96892db606d0e3f6d1b2265273e1b9f5ba63accdce10dd80cc8b9f0a4c0a2a68682667e0704b67937a54f23b08046a0b9eb9169b392e9c1041895bebab27892d77e18275ed2b9959e95e21c2fd838b29c8f166d51f3060a9825aa210b4575a301579cb8335bcf8c7d7e15e3e4a1d9ab2e89fcb9238fffa3c2a7fee9381419c1ec8b387efccc4040f312ab0a691e1a57d1abfe73772b02e6063ad9ea64df843aa2065d1adf08448f282e73f1706f087dfb61aa4c749949ea9b9d24f2372207d435e561f03b33f8461172968af82bf8503289edb7ab7ea54c8893f27f2c8922775804267e3a45693f5a411d9a421924130b533c03233bb210715ceda90a521b450b39d8023f7aa30ef9533c5bed79487763ff8f8bef0ec9fb520609d0aaec88260463631eaf0971c14ae8fcdc088fe3e9065fc259a25b732019fb86ae695f2190974333ad472a03cac50b6d7dfb7eeb2bdf8d944a90af3421246a65e4aedb28b9dd486cfa5d7428fce22d67ab8360fabac0ffe3017ef2e07469a97f932cdf897df3c71f968811953dd7b10497996ee3d55b081eb655b246a549b9da5d82e4f3f6a952c2a6cef062ea9f7a91789e330a098114db8767a6d5ed9e994d62069bb2dd16369cda23e68332c19ed2cf4c64077a66e63b98218f9b417693ec45a71b61c4729cf9adbdbc41066f86a8e60790e6568fc6bda36bfeec97324c0be0c62886eaa1459531c01b8907fd8e60a0c2884253baa424f06c8cac0a552758eb3dbcf042dec9ea9f92368e43721d192231c686c1f630abc21d1e8279c4297f8776b3f94ffdf8098480f5489c0f99f2f310571b02ba55ac53b9bde369964ea8a9f2321c33b6f6732e8750db192bb43ca8b59742176b70325f9e871504f2b7d185ebe1fdf22340eed375701cf390e65f7287558c9d7fca734fcaa71f416de3e145f9679903814888be939eae1a6ee937742ef46cd523d43517e1e0913407660a7834b52cc12fb45804ca975135310c7f3f8e5ef3cf1fa177dd62abbdaa1c417df6952474ee828efb5087265fb05467e35c7a883167e3c0562e90eab11726171399350c54199f801c4ca83ff4b1a96e82c4b657fa08ce27d9b8af61df359dd796bc3c23114c647a142aff4edf2de550c2cf75e3dc786f50b39d6cd496c8b71ba78c011051e8ca0b434a622fa98d8f5b7ba37c91fde71b8e6f6e15bf246e9976566446cbc119bd7aabd86404a72b30b4144f1179869ff7176af9247c6e0b4eefeb437e4e0651991e0df975ff9b0bd235ec303cd7135e4868973e52a4f123561c5d678e5d5dfab657999ef8fc1af0be46051e72186ffab9f172bc34367a41f93caf0b4f86bfd7805590b9360858a3ec6281f8781d020d27d3a84d7c489912564bc47cda461b9071b9f2f9a2f2f516feb4bf21beaaa7b8bf5bc716fd0a19fb4647b6b458d3fe3f96c5d7215ef73118a75be0fe869849c9e12868d80a2d01f35397a0d1ed14fec98782349f4d61c6015f250242cced07b9892373d246065abcbc2b06357fc793d92631eb1aef25b524a627ec745e3057be7c5285ce05171d18896ec91e6fb8b22871a8a1bfa9fde1a8eb3df736a6b9da9d84a513e602340cf4b01dbdff5f123eb61a2691805bb0d69edbd6477e5c1ec8b7d94d751529d3819bfc542c2bb9f306798fe7475350e5b9a12bcd97141e03c38be72808ebf14363cf94bf45e0d8bfe636693f4df4828a77d7af4b416c18c2dbd00f48a98e9afc2f72d1d74c24283d6827288831f6b70e0b0ef34f8a1625cbdfc4fa8704a4d2302ef45506a69109c7508a3c670213a8789bec0835d4454a2dfa6e6ea3c0d5e6d9211ad53f6eba2be5c92e1ff561a1eb98fef7a2c10b3f2a9799caf5c930031bdbd939f9b9ecb3e6aa7553e8aeb33227d853a7a37649f5fc5b92f7b9995978645ad9c7bfcb38eb65d2ed6400c239d82dac42248be3b478db0189dd854431d696d51934361c1a0390d9464da8a43274be87e5deb51aab032bc23785c5070b67acc7f43a2708ff057b4a5364c1b1f52df417da35cb00d2e827a36e99610310bdcb1e38f16345bb5e2d008503e7e083a8f2462d1f1ed143a9df70a4b0b8a8dba403cbbcb820002e899] */
