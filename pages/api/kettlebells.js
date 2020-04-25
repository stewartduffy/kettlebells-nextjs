const axios = require("axios").default;
const cheerio = require("cheerio");

const sitesToCheck = [
  "https://www.industrialathletic.com/4kg-cast-iron-kettlebell",
  "https://www.industrialathletic.com/12kg-cast-iron-kettlebell",
  "https://www.industrialathletic.com/16kg-cast-iron-kettlebell",
  "http://solidstrengthequipment.co.nz/4kg-kettlebell",
  "http://solidstrengthequipment.co.nz/12kg-kettlebell",
  "http://solidstrengthequipment.co.nz/16kg-kettlebell",
  "https://www.seventhsin.co.nz/collections/kettlebells/products/12kg-seventh-sin-kettlebell",
  "https://www.seventhsin.co.nz/collections/kettlebells/products/16kg-seventh-sin-kettlebell",
  "https://www.seventhsin.co.nz/collections/kettlebells/products/32kg-seventh-sin-kettlebell",
];

const checkUrl = (url, search) => {
  return url.search(search) > 0 ? true : false;
};

function getStatus(response, url) {
  // load up cheerio
  const $ = cheerio.load(response.data);
  let selectorValue = null;

  switch (true) {
    case checkUrl(url, "industrialathletic"):
      selectorValue = $("#form-action-addToCart").attr("value");
      return selectorValue === "Add to Cart" ? "Available" : "Out Of Stock";
    case checkUrl(url, "solidstrengthequipment"):
      selectorValue = $('.product-add-to-cart input[type="submit"]').attr(
        "value"
      );
      return selectorValue === "Add To Cart" ? "Available" : "Out Of Stock";

    case checkUrl(url, "seventhsin"):
      selectorValue = $("span.productlabel.soldout").text();
      return selectorValue === "Sold Out" ? "Out Of Stock" : "Available";
  }
}

const getHtml = async (url) => {
  const html = await axios.get(url);
  return {
    url,
    status: getStatus(html, url),
  };
};

export default async (req, res) => {
  try {
    const data = await Promise.all(sitesToCheck.map(getHtml));

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
};
