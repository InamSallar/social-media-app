# social-media-app
This is a social media application for enabling users to create an account, publish and mangage contents and follow each other to see their posts. 

The application will be developed only for demo purpose to show how an MVC application can be architected. 

# Functional Capabilities of the Applicaiton 
The application will have following features and components. 
  --Users creation & signup
  --Users authentication
  --Creating and publishing posts by users
  --Updating posts by users
  --Deleting posts
  --Following other users
  --Unfollowing other users 
  --Sessions management
  --Signout option for users
  
  
  # MVC Pattern for our Application 
  Therefore, MVC architecture is a one-of-a-kind approach to building web apps. As the MVC frameworks come packed with the handy advantages, it is easy to implement in your framework. The adoption of MVC architecture results in the lesser expense of time & money, and the ability to create multiple views makes it the best architecture for web app development. Therefore, the architecture that we will be using for developing this application is MVC. 
  
   # HOW THE MVC ARCHITECTURE WORKS?
The architecture is split into three parts – model, view, and controller. The model, view, and controller components are responsible to handle some application development aspects of both web/software. The very nature of the MVC framework is such that there is low coupling among models, views or controllers.

Simply put, the controller component gets all the requests for the application and then orders the model component to prepare any information required by the view. The view component makes use of the data from the controller and gives the final output.

 
 ![mvc](https://user-images.githubusercontent.com/38752490/175882897-6e1e2328-11a0-46fd-bc8a-62dd448a32b6.jpg)


  
  # Main components of our MVC application
  The code structure of the pattren we have used for our application has the following main components. 
  
  
  # Modal Component 
  In our application, as the model represents the data to the user, it is the most important level. This level defines the storage location of the application’s data objects. The model component is interlinked with the controllers of our application and view components. The model component need not be a single object and it may come as a structure of objects.
  
  # View Component 
  The view component displays the model data to the user. It helps in creating an interface that shows the final output to the user. It is obvious that a view component will not display anything of itself. The view component displays the output to the users upon receiving the instruction/information from the controller/model. In addition, it collects requests from the user-end and informs the controller.

The model component and view components are connected to each other. The view component gets the data necessary for the presentation from the model with the help of certain questions. These questions are answered and sent back to the view component with easy terminology so that they can understand the answers sent by the model/controller easily.
  
  # Controller Component 
  The controller component acts as the central unit of our MVC architecture. In addition, the controller component acts as a bridge between a user and the our application. The controller component understands the output, processes/converts it to appropriate messages and sends it to the view component.
  
  # Why we have chosen MVC pattern for our web application? 
  We have chosen MVC due to the following advantages and characteristics that an MVC pattern is having. 
  
  # 1. Accelerated Application Development Process:
How can you increase the development speed by adopting MVC architecture? Whenever an MVC architecture is being employed in developing a web application, one developer can concentrate on the view component whereas the other can focus on controller and create business logic. Therefore, when compared to other development models, the MVC model results in higher development speeds i.e. up to three times.

# 2. Develop Multiple View Components for your Model:
The MVC architecture empowers you to develop different view components for your model component. As you can witness an ever-increasing demand for new ways to access your web apps, MVC architecture is your one-stop solution for developing different view components. Also, the MVC model limits code duplication and separates the business logic and the data from the display.

# 3. MVC Supports Asynchronous Method Invocation (AMI):
Undoubtedly, MVC architecture works cohesively well with JavaScript Frameworks. As a result, you can run MVC apps on desktop widgets, site-specific browsers, and PDF files. The MVC architecture supports asynchronous method invocation (AMI) that bolsters developers in building quick loading web apps.

# 4. Modifications do not Affect the Entire Model:
Your web app’s UI gets new updates every now and then than your actual business model/rules. These include optimizing the color, layouts, font family, font size, and additional support for mobile/tablets. As already said, since the model, view and controller are independent components, making changes in the MVC architecture is very easy. Moreover, making changes in the model component will not have any adverse effects on the architecture.

# 5. MVC Model Returns the Data Without Formatting:
You can use and call the same components and put them into use with many interfaces. For instance, you can format data with HTML.

# 6. Ideal for Developing Large Size Web Application:
MVC architecture works exceptionally well when your web app demands the support of a huge developer team, and for web designers who require complete control over the app’s behavior.


  
  
  # Authors 
  Inamullah
  Bilal
  M.Qiass
  
