

// export const getSender = (loggedUser, users) => {
//   console.log("users in getsender",users)
//   // Check if the logged-in user is a freelancer or a client
//   let loggedInUserId;

//   if(loggedInUserId === loggedUser._id){
//     return users[0]._id === loggedInUserId ? users[0].first_name : users[1].first_name;

//   }else if (loggedInUserId === loggedUser.freelancer_id ){
//     return users[0]._id === loggedInUserId ? users[1].first_name : users[0].first_name;
//   }
 


//   // Return the name of the other user
// };


export const getSender = (loggedUser, users) => {
  // Log the received loggedUser and users array for debugging
  console.log("Logged User:", loggedUser);
  console.log("Users Array:", users);

  // Get the logged-in user's ID (either _id or freelancer_id)
  const loggedInUserId = loggedUser?._id || loggedUser?.freelancer_id;

  // Log the extracted loggedInUserId
  console.log("Logged In User ID:", loggedInUserId);

  // If loggedInUserId is not defined or the users array is not of length 2
  if (!loggedInUserId || users.length !== 2) {
    console.log("No match found for logged-in user, returning 'Unknown User'");
    return "Unknown User";
  }

  // Return the name of the user who is NOT the logged-in user
  const senderName = users[0]._id === loggedInUserId ? users[1].first_name : users[0].first_name;

  // Log the result for clarity
  console.log("Sender Name:", senderName);

  return senderName;
};







  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };


  export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
