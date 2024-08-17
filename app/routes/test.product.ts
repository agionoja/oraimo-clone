import { ActionFunctionArgs, json } from "@remix-run/node";
import Product, { IProductWithReviews } from "~/models/product.model";

export async function loader() {
  const products = await Product.findById<IProductWithReviews>(
    "66be1e1d65bf0521a1bf0650",
  )
    .populate("reviews")
    .exec();

  if (products) products.category.subcategory = "solar generators";

  return json({ products });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // const photos = formData.getAll("photos") as File[];

  const {
    name,
    marketName,
    price,
    discount,
    colors,
    category,
    features,
    specifications,
    parameters,
    availableQty,
  } = Object.fromEntries(formData);

  const parsedColors = JSON.parse(colors as string);
  const parsedCategory = JSON.parse(category as string);
  const parsedFeatures = JSON.parse(features as string);
  const parsedSpecifications = JSON.parse(specifications as string);
  const parsedParameters = JSON.parse(parameters as string);

  const product = await Product.create({
    name,
    marketName,
    price,
    discount,
    availableQty,
    colors: parsedColors,
    coverPhoto: {
      url: "http://fake.com",
      publicId: "fakeId",
    },
    photos: [
      {
        url: "http://fake.com",
        publicId: "kd53",
      },
    ],
    category: parsedCategory,
    features: parsedFeatures,
    specifications: parsedSpecifications,
    parameters: parsedParameters,
  });

  return json({ product }, { status: 201 });
}
