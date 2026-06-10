// let arr= [10,20,30,30,40,40,5,0,660,]; 

// let arr2 = [...new Set(arr)]; 

// let largestNum = -Infinity; 
// let secondLargest =  -Infinity;


// arr.forEach((ele)=>{
//       if(ele>largestNum){ 
//          secondLargest = largestNum ; 
//          largestNum= ele;
//       }
// }) 

// console.log(secondLargest); 








let base_url = "https://jsonplaceholder.typicode.com/"; 

let user_url= `${base_url}/users`; 


const userForm = document.getElementById('userForm'); 
const userContainer = document.getElementById('userContainer'); 
const emailControl = document.getElementById('email'); 
const contactControl = document.getElementById('contact'); 
const userNameControl = document.getElementById('name'); 

const addUser = document.getElementById('addUser'); 
const updateUser = document.getElementById('updateUser'); 

const userIdControl = document.getElementById('userId'); 


let UserArr =[] ;




function snackbar(msg,icon){ 
         swal.fire({ 
               title:msg,
               icon:icon,
               timer:3000
         })
}

function createUser(arr){ 
          let res =" "; 

        arr.forEach((ele,i)=>{ 
                res +=`<tr id=${ele.id}>
                     <td>${arr.length-i}</td>
                     <td>${ele.name}</td>
                     <td>${ele.phone}</td>
                     <td>${ele.email}</td>
                     <td><i onclick="onEdit(this)"  class="fa-solid fa-pen-to-square text-primary fa-2x"></i></td>
                     <td><i onclick="onRemove(this)" class="fa-solid fa-trash text-danger fa-2x"></i></td>
                  </tr>`
        })  

        userContainer.innerHTML=  res ;
}








function fetchUser(){ 
          

 let xhr= new XMLHttpRequest(); 

     xhr.open('GET', user_url);
     xhr.send(null);
    
     xhr.onload= function(){
          
     if(xhr.status>=200 && xhr.status<=200){ 
              UserArr= JSON.parse(xhr.response);
              
              createUser(UserArr.reverse());
           
      }else{ 
           snackbar('USEr api is Failed...!!',"error");     
      }  


    } 



}

fetchUser();





function onSubmit(eve){ 
        
      eve.preventDefault();
   
   
   let userObj ={ 
        name:userNameControl.value ,
        phone:contactControl.value ,
        email:emailControl.value ,
        userId:userIdControl.value 
      }  
      UserArr.push(userObj);  

   let xhr = new XMLHttpRequest() // to create Instance of Xhr
       xhr.open('POST', user_url); 
       xhr.send(JSON.stringify(userObj));
      
       xhr.onload = function (){ 
         if(xhr.status>=200 && xhr.status<=299){ 
                //to get id..
                
                let res = JSON.parse(xhr.response);
                let tr = document.createElement('tr')
                    tr.id = res.id; 
                    tr.innerHTML =`<td>${UserArr.length}</td>
                                    <td>${userObj.name}</td>
                                    <td>${userObj.phone}</td>
                                    <td>${userObj.email}</td>
                                    <td><i class="fa-solid fa-pen-to-square text-primary fa-2x"></i></td>
                                    <td><i class="fa-solid fa-trash text-danger fa-2x"></i></td>
                                 `
                 userContainer.prepend(tr);

         }else{ 
              snackbar('failed to show', "error")
         }
       }


}

function onRemove(ele){
        let removeId= ele.closest('tr').id;
        let remove_url=`${base_url}/users/${removeId}`;

      Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
         }).then((result) => {
            if (result.isConfirmed){ 
                   let xhr= new XMLHttpRequest() ;
                   xhr.open('DELETE', remove_url);
                   xhr.send(null);
                   xhr.onload = function(){ 
                     if(xhr.status>=200 && xhr.status<=200){ 
                          ele.closest('tr').remove();
                          
                        }else{
                               snackbar('Failed to delete User',  'error')
                        } 
                   }
            } 
        });
 }


function onEdit(ele){
      let editId= ele.closest('tr').id; 
         localStorage.setItem('EditId', editId);
       
      let editUrl = `${base_url}/users/${editId}`;
      
      let xhr =new XMLHttpRequest() ;
       xhr.open('GET', editUrl);
       xhr.setRequestHeader('content-type', 'application/json');
       xhr.setRequestHeader('Autho', 'Get token from');

       xhr.send(null); 
       
       xhr.onload = function(){ 
            if(xhr.status>=200 && xhr.status<=200){ 
                  let EditObj = JSON.parse(xhr.response); 
                  
                  userNameControl.value= EditObj.name;
                  contactControl.value= EditObj.phone;
                  emailControl.value= EditObj.email;
                  userIdControl.value= EditObj.userId;
  
                 addUser.classList.add("d-none");
                 updateUser.classList.remove('d-none');

            }else{
                  snackbar('failed to edit User', 'error');

            }
       }
}


function onUpdate(){ 
   let updateId=localStorage.getItem('EditId');
   
   let updateUrl  =`${base_url}/users/${updateId}`;
   let updateObj= {
         name:userNameControl.value ,
         phone:contactControl.value ,
         email:emailControl.value,
         userId:userIdControl.value 
      }
 
  let xhr= new XMLHttpRequest(); 
      xhr.open('PATCH', updateUrl); 
 
     xhr.send(JSON.stringify(updateObj)); 
     xhr.onload = function(){ 
          if(xhr.status>=200 && xhr.status<=200){ 
           let tr= document.getElementById(updateId).children; 
            tr[1].innerText =updateObj.name; 
            tr[2].innerText=updateObj.phone;
            tr[3].innerText=updateObj.email;

            addUser.classList.remove("d-none");
            updateUser.classList.add('d-none');
            userForm.reset();
          }else{ 
             snackbar('User update failed...!!', 'error')
          }
     }  
      

                


}






userForm.addEventListener('submit', onSubmit);
updateUser.addEventListener('click', onUpdate); 













     