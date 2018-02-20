// jQuery shorthand
$(petHotelApp)

function petHotelApp() {
    console.log('jQ and client.js are running. Inside petHotelApp');
    // Event listeners
    $('#registerButton').on('click', addNewOwner);
    $('#register_new_pet').on('click', registerNewPet);
    // $('#tableBody').on('click', '.deleteButton', deletePet);
    // $('#tableBody').on('click', '.editButton', editPet);
    // $('#tableBody').on('click', '.checkStatus', updatePetStatus);
    // $('#tableBody').on('click', '.update_pet', updatePetInformation);
    // $('#showVisitsButton').on('click', getPetVisits);
//     if (location.pathname == '/') {
//         console.log('Inside Location Pathname');
//         getAllPets()
//         }
populateSelect();
}

function addNewOwner() {
    const ownerToSend = {
        first_name: $('#owner_first_name').val(),
        last_name: $('#owner_last_name').val()
    };
    addOwnerToOwnerTable(ownerToSend);

}//end addNewOwner

function addOwnerToOwnerTable(newOwner){
  $.ajax({
    url: '/owner.router',
    type: 'POST',
    data: newOwner
  }).done(function(data){
      console.log( 'added owner: ', data );
      populateSelect();
  })
    .fail(function(error){
      console.log('failure on post owner');
  });
}//end addOwnerToOwnerTable

function addPetToPetTable(petToAdd){
  $.ajax({
    url: '/pet.router',
    type: 'POST',
    data: petToAdd
  }).done(function(data){
    console.log('added pet', data);
    addPetToPetOwnerTable(petToAdd);
  })
  .fail(function(error){
    console.log('failure on pet POST');
  })
}//end addPetToPetTable

function addPetToPetOwnerTable (petToAdd){
  $.ajax({
    url: '/pet.router/pet_owner',
    type: 'POST',
    data: petToAdd
  }).done(function(data){
    console.log('added pet', data);
  })
  .fail(function(error){
    console.log('failure on pet POST');
  })
}// end addPetToPetOwnerTable

function populateSelect(){
  $.ajax({
    url:'/owner.router',
    type: 'GET'
  }).done(function(data){
    console.log('success in ownerGET', data);
    writeToSelect(data);
  })
  .fail(function(error){
    console.log('error on ownerGET', error);
  })
}//end populateSelect

function registerNewPet (){
  const petToRegister = {
    pet_name: $('#pet_name').val(),
    pet_breed: $('#pet_breed').val(),
    pet_color: $('#pet_color').val(),
    pet_owner: $('#owner_select').val()
  };
  addPetToPetTable(petToRegister);
}//end registerNewPet

function writeToSelect(data){
  console.log(data, 'data in write to select');
  $('#owner_select').empty()

  for(i=0; i<data.length; i++){
    let ownerToWrite = data[i];
    console.log(ownerToWrite);
    $('#owner_select').append(`<option value="${ownerToWrite.owner_id}">${ownerToWrite.owner_first_name}`+' '+`${ownerToWrite.owner_last_name}</option>`);
  }//end for
}//end writeToSelect
