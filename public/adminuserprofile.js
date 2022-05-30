function deleteAccount(id) {
    console.log(id);

     $.ajax({
         url: `/timeline/user/remove/${id}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}



function UpdateID(id) {

    let newID = $("#id_"+id).val();
    console.log(id, newID);


     $.ajax({
         url: `/timeline/user/update/ID/${id}/${newID}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}

function UpdateEmail(id) {

    let newID = $("#email_"+id).val();
    console.log(id, newID);


     $.ajax({
         url: `/timeline/user/update/email/${id}/${newID}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}


function UpdateNickName(id) {

    let newID = $("#nickname_"+id).val();
    console.log(id, newID);


     $.ajax({
         url: `/timeline/user/update/nickname/${id}/${newID}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}

function UpdateCellphone(id) {

    let newID = $("#cellphone_"+id).val();
    console.log(id, newID);


     $.ajax({
         url: `/timeline/user/update/cellphone/${id}/${newID}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}

function UpdateAdmin(id) {

    let newID = $("#admin_"+id).val();
    console.log(id, newID);


     $.ajax({
         url: `/timeline/user/update/admin/${id}/${newID}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}