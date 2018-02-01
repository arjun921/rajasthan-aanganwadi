import os
from distutils.dir_util import copy_tree
from jsmin import jsmin

copy_tree('UI/','Aanganwadi/www/')
jsList = os.listdir('Aanganwadi/www/js/')
path = 'Aanganwadi/www/js/'
for x in jsList:
    if x != '.DS_Store':
        # print("File {} has been edited.".format(x))
        open_file = open(path+x,'r')
        s = open_file.read()
        s = s.replace('../UI/','')
        open_file.close()
        write_file = open(path+x,'w')
        write_file.write(jsmin(s))
        write_file.close()
print('Copying Complete')
with open("Aanganwadi/config.xml","r+") as f:
    old = f.read()
    start = old.find('adi\" version=\"')+14
    end = old.find('\" xmlns=\"h')
    currentVersion = old[start:end]
    versionArr = currentVersion.split('.')
    versionArr[-1] = str(int(versionArr[-1])+1)
    newVersion = '.'.join(versionArr)
    # print(currentVersion,newVersion)
    updated = old.replace(currentVersion,newVersion)
    f.write(updated)
print('Version updated to v'+newVersion)
os.system('cd Aanganwadi && phonegap run android')
os.system('open Aanganwadi/platforms/android/build/outputs/apk')
# os.system('git add .')
# message = '\"Run version update v'+newVersion+'\"'
# os.system('git commit -m '+message)
