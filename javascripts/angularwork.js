console.log("this is working");


// CREATING ANGULAR APP
 project=angular.module('project', ['ngRoute']);
var email=null;
var password=null;

//METHOD FOR CHECKING ERROR CONNECTION LATER
var checkingConnection=function(status)
{
    if(status==0)
    {
        alert("Sorry,couldn't connect.Check your connection");
    }
}
// IMPLEMENTING THE ROUTING FOR THE APP
 project.config(function($routeProvider)
{
    $routeProvider.when('/', { templateUrl : "homepage.html",controller:"loginSignup"
})
.when('/login' , {templateUrl:'login.html', controller:'login'})
})



// CONTROLLLER FOR LOGIN TO MANAGE ALL THE TASKS
project.controller('login', ['$scope' , '$http','$rootScope','$location' , function($scope,$http,$rootScope,$location)
{
    $scope.userLoggedIn=$rootScope.loggedIn;
    if(!$scope.userLoggedIn)                               //CHECKING WHETHER USER IS LOGGED IN OR NOT
    {
$location.path('/');
    }




    $scope.userName="";
    $scope.userJob="";
    $scope.page=1;
    $scope.selected=0;
$scope.placeholder='name';




$scope.userOption=function(value,pageNumber)
{
  
    $scope.countarray=[0,1,2]
$scope.page=pageNumber
if(value=='list')                              //CHECKING THE OPTION USER SELECTED
{
    
    $scope.firstname=[];                            
    $scope.lastname=[];
    $scope.id=[];
    $scope.avatar=[];
     $http.get ('https://reqres.in/api/users?page=' + $scope.page).then(function(data)  //FETCHING USERS LIST DATA FROM API
    {
        $scope.selected=1;
       for(i=0;i<=2;i++)
       {
        
           $scope.firstname[i]=data.data.data[i].first_name;               //INITILIZAING DATA 
           $scope.lastname[i]=data.data.data[i].last_name;
           $scope.id[i]=data.data.data[i].id;
           $scope.avatar[i]=data.data.data[i].avatar;
           
       }

    } ,function(err)         // IF THERE IS CONNECTION ERROR
{
    $scope.selected=0;
   checkingConnection(err.status);
} ) 
    $scope.editing=function(placeHolder, i)       //FUNCTION CALLED WHEN USER CLICKED FOR EDIT
{
    console.log(placeHolder);
   
    $scope.placeholder=placeHolder;
    $scope.userName=placeHolder;
    $scope.userJob=""
$scope.create=function()                
{
    var updateData={name:$scope.userName,job:$scope.userJob}
    $http.put(('https://reqres.in/api/users/2') , updateData).then(function(data)   //POSTING DATA FOR UPDATE
{
    if(data.data.name.length>=4&&data.status==200)
    {
        $scope.firstname[i]=data.data.name;             //ASSIGNING DATA
        alert("user has been updated");
    }
} , function(err)            //CHECKING ERROR
{
    checkingConnection(err.status);
} )


}


}

$scope.delete=function(i)                  //DELETE FUNCTION
{
    $http.delete('https://reqres.in/api/users/'+$scope.id[i]).then(function(data)
{
console.log(data);
$scope.countarray.splice(i,1);
} , function(err)
{
    checkingConnection(err.status);
} )
}



}


if(value=='create')           //FUNCTION CALLED FOR CREATING 
{
    $scope.userName="";
    $scope.userJob="";
    $scope.selected=2;
    $scope.placeholder='name';
 $scope.create=function()
 {
     console.log($scope.userName);
     var userData={ name:$scope.userName, job:$scope.userJob}
$http.post('https://reqres.in/api/users', userData).then(function(response)    //POSTING DATA FOR NEW USER
{
    console.log(response)
   if(response.status==201&&response.data.name.length>=4)
   {
       alert('NEW USER CREATED')
   }
} ,function(err)
{
    checkingConnection(err.status);
} )


 } 

}







}


}])






//HOMEPAGE CONTROLLER

project.controller("loginSignup" , [ '$scope' , '$http' ,"$location" ,"$rootScope", function($scope,$http,$location,$rootScope)
{
$scope.email=""
$scope.password="";
$scope.confirmPassword=""
$scope.signuppassword=""
$scope.signupemail=""
$rootScope.loggedIn=false;

    $scope.signupMethod=function()               
{                                                     //SIGNUP METHOD
console.log($scope.signupemail);
console.log($scope.signuppassword);
console.log($scope.confirmPassword);
if($scope.confirmPassword==$scope.signuppassword)
{
    var signupData={email:$scope.signupemail,password:$scope.signuppassword}
$http.post('https://reqres.in/api/register' , signupData).then(function(data)    //CHECKING FROM API
{
   if(data.data.token)
   {
       alert("You have succesfully registered");
       $rootScope.loggedIn=true;
       $location.path('/login');                               //GRANTING LOGINACCESS
   }
 },function(err)
{
    checkingConnection(err.status);

})

}
else{
    $scope.confirmPassword='';                               //PASSWORD DOES NOT MATCH
    $scope.signuppassword='';
    alert("Password not matched.Try Again.")
}

}



$scope.loginMethod=function()                        //LOGINMETHOD
{
console.log($scope.email);
console.log($scope.password);
userdata={email:$scope.email, password: $scope.password};
$http.post('https://reqres.in/api/login' , userdata).then(function(data)   
{
    console.log(data)
if(data.data.token)
{
$rootScope.loggedIn=true;                                 //GRANTING LOGIN
     $location.path('/login');
}

else
{
    
    $location.path('/');                          //FAILED LOGINATTEMPT
}
}, function(err)
{

    checkingConnection(err.status);
})



}
}])






