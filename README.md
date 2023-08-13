--> Developed a website solution aimed at revolutionizing the logistic industry by creating a direct connection between truck owners and load owners eliminating the need for traditional brokerages.

-->This Website empower user to transparently post and  book trucks and loads directly,optimizing the logistic process while minimizing the cost and maximizing profit for both truck owners and load owners.

-->Users can easily access of recently posted trucks and loads within the last 7 days. They can then further narrow down their search by specifying the 'from' and 'to' locations, ensuring efficient and relevant results.

-->Implemented real-time load tracking feature within our logistics platform, empowering load owners to seamlessly monitor the live location of their shipments through a designated load ID obtained during the booking phase.

-->Implemented real-time fuel price and weather condition tracking functionality within the logistics platform, enabling users to access up-to-date information for optimized route planning and decision-making

"Develop a comprehensive digital platform that serves as a direct and transparent marketplace for truck owners and load owners, aiming to revolutionize the traditional transportation industry. The platform should eliminate the need for intermediary transport agents and their associated commissions, offering cost-effective and secure solutions for both truck owners and load owners. Ensure seamless user experience, real-time tracking, secure payment options, and user verification mechanisms to build trust and streamline the transportation process. The goal is to create a user-centric ecosystem that enhances efficiency, reduces costs, and provides a trustworthy environment for all stakeholders involved in the transportation process."


**THE FEATURES:**

	Signup and login 

	Forgot username and forgot password options

	Urgent booking of truck if they cannot able to find the Right truck

	Loads Owners can track the truck carrying the load

	Posting the load and Posting the  truck

	Booking the truck and booking the load and list of loads and trucks available

	Filtering the load and truck based on from and to location

	End users can communicate and negotiate through whatsup

	Users can check their fuel prices across  india

	Drivers can check the weather condition 

	User information are salted and hashed before storing in database to enhave privacy



**The Langauges and tools I sused to build this webite are**

	HTML,CSS,Bootstap and Javascript for frontend

	Node js and MOngoDb atlas for back end

	I used git as version control

	Gitgub to store gitrepository

	I deployed it using cyclic.sh which is free hosting platform

First I will list out the what are features in this website and after which I will explain it brienfly sir





**THE INDIVIDUAL FEATURES:**

**SIGNUP AND LOGIN:**

	Users can signup by entering the email id,username,pass word ,and username and submit the form

	Once the form is submitted An OTP is send to the users entered email id  and Next page opens asking users to enter the OTP

	The the entered OTP is matches OTp send through mail the users users details are stored in database along salting and hashing users passwords using bcrypt

	Once signup user can enter the enter the username and password and login

	Once login is succesfull all the details will be stored in cache which will used for further communication purpose

**FORGOT USERNAME AND FORGOT PASSWORD:**

	If the user forgot the username user can make use of forgot username option and enter the registered email and get the username associated with that password

	If the user forgot the password user can make use of forgot password and enter the username and once the form is submitted the OTP will send to registered email id and new page opens for password change

	Where user can enter the new password and confirm password and OTP and if OTP matches the otp send through mail password will be changes.

**POSTING THE LOAD AND POSTING THE TRUCK:**

**POSTING THE LOAD:**

	If the load owners want to transport the goods for one location to another location they can post their 

	We can post the load by entering the details such as fromlocaion, to location, load type,quantity,their quoted prices,phone number and decription and the forms

	And those details will be stored in database once form I submitted

	If some Trucks owners want to book your load means they can just connect with them by clicking book now button which will be redirected to whatsapp

POSTING TRUCK:

	Truck owners who are expecting for a load can post the load mentioning current location and destination can post their the truck by entering the information such such current location,to location,vehicle numbervehicle type,vehicle length,vehicle capacity,phone number and description once the form is submitted it will be automatically stored in the databse

List of Available Loads(where Trucks owners can book the load right fitting for them) :
	The list of loads that are posted within the last 7 days will appear here

	Users can filter the load by using from location,to location

	The users can can make use of book Now button and communicate with load owner to know more information about load

**List of Available Truck:**
	The list of trucks that are posted within last 7 days wil appear here

	The can filter the load using from and to location

	The users can make use of book now button and communicate with Truck owners to book a truck

------------------------------------------------------------------------------------------------------------
**Booking truck immediately:**

	If you cannot able to find any truck then you can book a truck immediately from SMT Transport and get a unique loaded after confirmation

**TRACK THE LOAD:**
	Once you get a unique loadid

	We will link the tracklink of the booked vehicle with your load id

	By entering unique load id the tracking link will be stored with you registered email id

---------------------------------------------------------------------------   
	The fuel prices and weather condition will be much useful for driver

	Some times the diesel prices between state to state various upto 7 rupees and didtruct to district various upto  rupees

	By checking weather condition they can decide whether they can move further or take rest here

**Check feuls price:**
	Once you click a fuel prices It will display a list of state in india

	Once you click a state like of distruct available within the state will be displayed

	Once you clicked the district,the petrol,diesel,LPG,CNG price will be displayed

	If fuels price and weather consdition is present in same website it would be very much useful for drivers

	The reason behind this is Th diesel price between district sometimes varies between .5 -1 rupess if they find the diesel price according to district the call fill where they fell it is economical

**Checking Weather condition:**

	For getting weather condition I used openweathermap

	After requesting ApI I get get the list the data but the app only display the list that are useful for driver
	First and formost: Temperature: Consider A truck is carring a Heay load if the temperature in more tyre busting make takes palce
	Wind speed:which is the major factor for reduce in mileadge
	And Visibility If it is very less they can stay before some place till it get clear
