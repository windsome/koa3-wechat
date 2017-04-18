import fs from 'fs'

const config = {
    wechat : {
        origin:'gh_xxxxxxxxxxxx',
        appId:'wxxxxxxxxxxxxxxxxx', 
        appSecret:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 
        encodingAESKey:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        token:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

        templateLuckyResult: 'MTqaQApt3LxAMJwfOv22nJT7Z9PhxsOoNTGlb70MHhA',
        templatePaySucess: 'N3yUOkRfJnZm20o4d05PfaXNx3e8dVRxP5CS56MpFPA',
        templateRefundNotify: 'OY03iGHmcS6p0uonomEQc-5ffo1SV3XJrCbHS4bCu4A',
        templateOrderCancel: 'UzWD5q-1rdwchnKkHV20768ty2kvSyzmLZKGNQrzt_8',
    },
    wechatPay : {
        appId:'wxxxxxxxxxxxxxxxxx', //服务商APPID，邮件中
        mchId: '14xxxxxxxx',
        notifyUrl: 'http://xxx.xxx.xxx/wcapis/v1/pay_notify',
        partnerKey:'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        subAppId:'xxxxxxxxxxxxxxxxxx',
        subMchId: '14xxxxxxxx',
        pfx: fs.readFileSync(__dirname + '/apiclient_cert.p12'),
        passphrase:'14xxxxxxxx',
    },
}

export default config;
