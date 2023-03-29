
export const signup = async (user) => {
    
    try {
        const response = await fetch('http://localhost:8000/auth/signup', {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        return await response.json();
    } catch (err) {
        return { error: err };
    }
    };
    
    export const signin = async (user) => {
        // console.log(name, email, password);
        try {
            const response = await fetch("http://localhost:8000/auth/login", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user),
            });
            return await response.json();
        } catch (err) {
            return { error: err };
        }
};
    
export const authenticate = (data, next) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data))
        next();
    }
}
    

 export  const  signout = async next => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        next();
        try {
            const res = await fetch("http://localhost:8000/auth/signout", {
              method: "GET",
            });
            console.log('SignOut', res);
        } catch (err) {
            return console.log(err);
        }
    }

};


export const isAuthenticated = () => {
    if (typeof window == 'undefined') { 
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'))
    }
    else
        return false;
}