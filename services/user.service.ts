// async function getData() {
//   const url = "https://example.org/products.json";
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`Response status: ${response.status}`);
//     }

//     const json = await response.json();
//     console.log(json);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// const myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// const response = await fetch("https://example.org/post", {
//   method: "POST",
//   headers: myHeaders,
//   body: JSON.stringify({ username: "example" }),
//   // ...
// });

const _URL = process.env.EXPO_PUBLIC_API_URL;

export const createUser = async (user: any) => {
  try {
    console.log("user", user);
    
    const response = await fetch(`${_URL}user/clerk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clerkId: user }),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const getUser = async (clerkId: string) => {
  try {    
    const response = await fetch(`${_URL}user/clerk/${clerkId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {    
    const response = await fetch(`${_URL}user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });    
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const updateUserCredtials = async (data: {
  oldPassword: string;
  password: string;
  clerkId: string;
}) => {
  try {
    const response = await fetch(`${_URL}user/credentials`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });    
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await fetch(`${_URL}user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
};
