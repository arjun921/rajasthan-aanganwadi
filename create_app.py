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
os.system('cd Aanganwadi && phonegap build android --release  -- --keystore="/Users/arjun921/working_directory/rajasthan/key/Aanganwadi.keystore" --storePassword=aanganwadi --alias=aanganwadi')
os.system('open /Users/arjun921/working_directory/rajasthan/Aanganwadi/platforms/android/build/outputs/apk')
