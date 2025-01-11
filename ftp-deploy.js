import { FtpClient } from require('ftp-app-to-remote');
// "ftp-app-to-remote/projects/ftp-app-to-remote/src/public-api"; // Adjust the path to your class

// async function run() {
//     const ftpClient = new FtpClient();
//     await ftpClient.connect("nt35.unoeuro.com", 21);
//     await ftpClient.login("instantcms.dk", "x23G9FtzenyRAgka6pd4");
//     await ftpClient.listFiles();
//     ftpClient.disconnect();
// }

async function run() {
    const [h, p, usr, pwd] = process.argv.slice(2);

    if (!h || !p || !usr || !pwd) {
        console.error("Usage: npm run start -- <h> <p> <usr> <pwd>");
        process.exit(1);
    }

    const ftpClient = new FtpClient();
    try {
        await ftpClient.connect(h, parseInt(p, 10));
        await ftpClient.login(usr, pwd);
        await ftpClient.listFiles();
    } catch (err) {
        console.error("An error occurred:", err);
    } finally {
        ftpClient.disconnect();
    }
}

if (require.main === module) {
    run();
}