import os
path = 'UI/js/'
js = os.listdir(path)
print(js)
search = input('Enter string to search:\n')
replace = input('Enter string to replace with:\n')
for x in js:
	print(x)
	f = open(path+x,'r')
	s = f.read()
	f.close()
	s.replace(search, replace)
	f = open(path+x,'w')
	f.write(s)
	f.close()
