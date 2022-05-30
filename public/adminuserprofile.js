function deleteAccount(id) {
    console.log(id);

     $.ajax({
         url: `/timeline/user/remove/${id}`,
         type: "get",
         success: (e) => {console.log(e)}
     })
}