import toast from "react-hot-toast";

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
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"(?:\\/\\/)" + // host may be surrounded by slashes
			"([\\da-z\\.-]+)\\." + // domain name
			"([a-z\\.]{2,6})\\/" + // TLD
			"([\\w\\/\\.\\-\\?\\,]*)?" + // path
			"([\\w\\?\\=\\&\\-\\+\\%\\$]*)?" + // query string
			"(#[\\w\\-]*)?$",
		"i"
	);
	return pattern.test(str);
};

export default SendNotification;
export { IsURL };
