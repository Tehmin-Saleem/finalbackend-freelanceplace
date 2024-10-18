export const getSender = (loggedUser, users) => {


  // Ensure both `loggedInUserId` and `users` array are valid
  if (!loggedUser || !users || users.length < 2) {
    return null;  // or handle the error as per your logic
  }

  // Check if the first user is the logged-in user
  if (users[0]._id === loggedUser) {
    // Return the name of the other user (user 1 in the array)
    return users[1].first_name;
  } else if (users[1]._id === loggedUser) {
    // Return the name of the other user (user 0 in the array)
    return users[0].first_name;
  }

  // If no match is found, return null or handle appropriately
  return null;
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
