const axios = require("axios").default;
const mailgun = require("mailgun-js");

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendEmail = async (text) => {
  const data = {
    from: process.env.MAILGUN_FROM,
    to: process.env.MAILGUN_TO,
    subject: "Kettlebell now in stock!",
    text,
  };

  mg.messages().send(data, function (error, body) {
    console.log(body);
  });
};

export default async (req, res) => {
  try {
    const { data } = await axios.get(process.env.API_URL);

    const inStock = data.filter(({ status }) => {
      return status === "Available";
    });

    if (inStock.length > 0) {
      const text = inStock
        .map(({ url, status }) => {
          return `${url} -  ${status}`;
        })
        .join("\n");

      sendEmail(text);
    }

    console.log("data: ", data);
    console.log("inStock: ", inStock);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
};
