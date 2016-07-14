
function validateForm(){

  var a = document.forms.Form.title.value;
  var b = document.forms.Form.url.value;

   if (a===null || a===""|| b===null || b==="")
   {
   alert("Both Title and URL must be filled!");
   return false;
   }
}
