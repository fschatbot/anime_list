import toast from "react-hot-toast";

// https://react-hot-toast.com/
const SendNotification = (message, type = "info") => {
	console.log(`${type}: ${message}`);
	toast[type === "info" ? "success" : "error"](message, {
		position: "top-right",
		autoClose: 3000,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
};

const IsURL = (str) => {
	var pattern = /^(ftp|http|https):\/\/[^ "]+$/;
	return pattern.test(str);
};

export default SendNotification;
export { IsURL };
