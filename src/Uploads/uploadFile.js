

export const uploadFile = async (file) => {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset","chat-app");

  const response = await fetch("https://api.cloudinary.com/v1_1/datoucjos/auto/upload", {
    method: "post",
    body:formData,
  });

  const responseData = await response.json();
//console.log(responseData)
  return responseData;
};




