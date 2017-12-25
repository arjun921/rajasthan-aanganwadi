import os
from distutils.dir_util import copy_tree

copy_tree('UI/','Aanganwadi/www/')
jsList = os.listdir('Aanganwadi/www/js/')
path = 'Aanganwadi/www/js/'
for x in jsList:
    if x != '.DS_Store':
        print("File {} has been edited.".format(x))
        open_file = open(path+x,'r')
        s = open_file.read()
        s = s.replace('../UI/','')
        open_file.close()
        write_file = open(path+x,'w')
        write_file.write(s)
        write_file.close()
with open("Aanganwadi/config.xml","r+") as f:
    old = f.read()
    start = old.find('adi\" version=\"')+14
    end = old.find('\" xmlns=\"h')
    currentVersion = old[start:end]
    versionArr = currentVersion.split('.')
    verStr = ''.join(versionArr)
    newVer = int(verStr)+1
    newVerArr = [x for x in str(newVer)]
    newVersion = '.'.join(newVerArr)
    updated = old.replace(currentVersion,newVersion)
    f.write(updated)
os.system('cd Aanganwadi && phonegap run android')
os.system('open Aanganwadi/platforms/android/build/outputs/apk')
os.system('git add .')
message = '\"App run version update v'+newVersion+'\"'
os.system('git commit -m '+message)
os.system('git push')
