# firebaseProject

## 1. Project Specifications:
* firebase project with a real-time database using Node.js
* This database will have two nodes “users” and “userInformation”

## 2. Project will do following:
* Listen to the “users” node and do the following when a new user (i.e. username and user email) is saved in that node
	i.  save the same data to another node in firebase called “userInformation”
	ii. create an email and send it to the user email id.
    
## 3. Following are some requirements for setting up project:
* node must be installed in your system
* when node is installed, install birebase
* firebase can be install by
```
"npm install --save firebase"
```
* now open command prompt or terminal in you system and do following:	
	i.    download this project zip or git clone this repo
	ii.   go to downloaded or clonned project folder in command prompt or terminal
	iii.  type
```
"node index"
```
and hit enter
	iv.   go to browser and enter
```
"localhost:3000"
```
and there you go.
		
### Note: Internet is must

## License

This project is licensed under the GNU GPL v3 License - see the [LICENSE.md](LICENSE.md) file for details
