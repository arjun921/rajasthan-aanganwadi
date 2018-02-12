## Aanganwadi App

### Folder structure

- `Aanganwadi ` folder is the phonegap project folder. 
- `Aanganwadi/www` contains the html files for the app.

### Running the app using phonegap.

Make sure you `phonegap cli` installed.  Refer [link](http://docs.phonegap.com/getting-started/1-install-phonegap/cli/) for more information

Make sure to have all the dependencies for each platform installed that you're trying to run.

First navigate to the phonegap project folder.

```bash
$ cd Aanganwadi
```

#### Android

Connect device/emulator to adb.

```Bash
$ phonegap run android
```

Disclaimer: Needs Android SDK, adb tools and adb drivers to be installed and adb access granted if running on device. 

#### iOS

```bash
$ phonegap run ios
```

Disclaimer: Needs **Xcode and xcode developer tools** installed on a **MacOS** machine with phonegap to run iOS app on local tethered device. 

#### Windows

Depending on platform of interest

```bash
$ phonegap run wp8
```

```Bash
$ phonegap run windows
```

Disclaimer: needs visual studio and other prequisites installed on a windows machine to build for windows phone.

### Creating app for deployment

#### Android

In order to create a keystore with a different password:

```bash
$ keytool -genkey -v -keystore Aanganwadi.keystore -alias Aanganwadi -keyalg RSA -keysize 2048 -validity 100000
```

To create app run the following

```bash
$ cd Aanganwadi && phonegap build android --release -- --keystore="../key/Aanganwadi.keystore"  --storePassword=aanganwadi --alias=aanganwadi
```

Enter password `aanganwadi`

```Bash
$ open platforms/android/build/outputs/apk
```

#### **iOS**

Due to non availability of iOS developer licence, a guide hasn't been mentioned. For information on deployment of phonegap app to iOS devices, refer the following [link](https://stackoverflow.com/questions/6632350/how-to-deploy-phonegap-app-to-ipad-iphone). 

#### **Windows**

Please refer the [official documentation](http://docs.phonegap.com/en/edge/guide_platforms_wp8_index.md.html) on how to deploy to windows devices.

