import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineEye } from "react-icons/hi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import PaymentLogo from "../../components/assets/payment-logo.webp";
import ProductCard from "@bable/components/features/Products/ProductCard";
import Star from "@bable/components/features/Rating/Star";
import Modal from "@bable/components/features/Products/Modal";
import { toast } from "react-toastify";
import {
  addToCart,
  decreaseCart,
  removeFromCart,
} from "@bable/redux/features/products/cartSlice";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { addToWishList } from "@bable/redux/features/products/wishlistSlice";
import { CREATE_REVIEW } from "@bable/components/constants/API/Products/review.api";
import { FETCH_REVIEW } from "@bable/components/constants/API/Products/review.api";
import { UPDATE_REVIEW } from "@bable/components/constants/API/Products/review.api";
import { DELETE_REVIEW } from "@bable/components/constants/API/Products/review.api";
import {
  FETCH_ALL_PRODUCT,
  GET_PRODUCT_IMAGE,
  REVIEW_IMAGE,
} from "@bable/components/constants/API/Products/products.api";
import { FETCH_SINGLE_PRODUCT } from "@bable/components/constants/API/Products/products.api";
import Loader from "@bable/components/components/LoadingScreen/LoadingComponents/Loader";
import ProductImageArray from "@bable/components/features/Products/ProductImageArray";
import CommentSlider from "@bable/components/features/Products/CommentSlider";
import { FETCH_USERS_ALL_ORDER } from "@bable/components/constants/API/Orders/orders.api";
import SocialShareComponents from "@bable/components/components/SocialShareComponents/SocialShareComponents";
import { FRONTEND_BASE_SHARE_URL } from "@bable/components/constants/BaseUrl";
import ImageInput from "@bable/components/features/Rating/ImageInput";
import { reviewImageUploadToSupabase, reviewimageDeleteFromStorageApi } from "@bable/components/features/Rating/ReviewImageUploadToSupabase";
import { RxCross2 } from "react-icons/rx";

const Product = ({
  product,
  allproduct,
  totalReview,
  reviewData,
  loading,
  imageData,
}) => {
  const share_url = `${FRONTEND_BASE_SHARE_URL}/${product._id}`;
  let imageArray = imageData.map((i) => i.image_url);
  const userId = useSelector((state) => state.user.userId);
  const countReview = reviewData.map((i) => +i.star);
  var sum = countReview.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const star = sum / totalReview;

  const [showModal, setShowModal] = useState(false);
  const [updateShowModal, setUpdateShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [updateRating, setUpdateRating] = useState(0);
  const [updateHover, setUpdateHover] = useState(0);
  const [index, setIndex] = useState(0);
  const [updateComment, setUpdateComment] = useState("");
  const [allImage, setAllImage] = useState([]);
  const [arrayOfImages, setArrayOfImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const username = localStorage.getItem("username");
  const dispatch = useDispatch();
  const router = useRouter();
  const [showReviewImage, setshowReviewImage] = useState([]);

  const user_review_data = reviewData.filter((review) => review.userId == userId)
  // let showReviewImage = []
   let img_review = user_review_data.map((item)=>item.review_images)[0]
   useEffect(() => {
     setshowReviewImage(img_review)
    }, [imageData, img_review]);
    let [deleteImageArray, setDeleteImageArray] = useState([]);
    console.log(deleteImageArray)

  const handleDeleteImages = async (file, id) => {
    console.log(file, id)
    deleteImageArray.push({ files: file, id: id });
    setshowReviewImage(showReviewImage.filter((img) => img.file_name !== file))
 
    let message = `Product Image Deleted successfully`;

    // ShowToaster( TOAST_TYPE.SUCCESS, message)
  };


  const handleImages = (images) => {
    setAllImage(images);
  };
  const uploadAllImage = async () => {
    let imageData = null;
    try {
      if (allImage.length > 0) {
        // setIsLoading(true);
        for (let i = 0; i < allImage.length; i++) {
          imageData = await handleImageUpload(allImage[i]);
          let fileName = timeStamp + "" + allImage[i].name;
          const imageUrl = `${REVIEW_IMAGE}/${fileName}`;
          let image_obj = {
            image_url: imageUrl,
            file_name: fileName,
          };
          arrayOfImages.push(image_obj);
        }
        // setIsLoading(false);
        return imageData;
      } else {
        let message = "Something went wrong please try again";
      }
    } catch (error) {
      console.log(error);
    }
  };
  const timeStamp = Math.floor(Date.now() / 1000);

  const handleImageUpload = async (file) => {
    try {
      const fileName = timeStamp + "" + file.name;
      return reviewImageUploadToSupabase(fileName, file);
    } catch (error) {
      // let message = 'Something went wrong please try again';
      // ShowToaster(TOAST_TYPE.ERROR, message)
    }
  };

  const onSubmit = async (id) => {
    // e.preventDefault()
    const payload = {
      username: username,
      productId: product._id,
      star: updateRating ? updateRating : reviewData.map((i) => i.star)[0],
      comments: updateComment
        ? updateComment
        : reviewData.map((i) => i.comments)[0],
      userId: userId,
    };
    const res = await axios
      .patch(`${UPDATE_REVIEW}/${id}`, payload)
      .then((data) => data)
      .catch((err) =>
        toast.error(err.response.data.message, {
          position: "top-right",
        })
      );
    if (res) {
      toast.success(` Your Comment has been successfully Updated`, {
        position: "top-right",
      });
      Router.reload(window.location.pathname);
    }
  };
  const handleAdd = (product) => {
    dispatch(addToCart(product));
  };
  const handleAddwishlist = (product) => {
    dispatch(addToWishList(product));
  };

  const openModalFetchData = async () => {
    setUpdateShowModal(true);
  };
  const myRef = useRef();
  const handleTab = (index) => {
    setIndex(index);
    const images = myRef.current.children;
    for (let i = 0; i < images.length; i++) {
      images[i].className = images[i].className.replace("active", "");
    }
    images[index].className = "active";
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    let image = null;
    if (allImage.length > 0) {
      image = await uploadAllImage();
    }
    console.log(arrayOfImages, "supabase image");
    let review_images = ["a", "b", "c", "d"];
    const payload = {
      username: username,
      productId: product._id,
      star: rating,
      comments: comment,
      review_images: arrayOfImages,
      userId: userId,
    };
    if (!rating) {
      toast.error("Please add some Rating ", {
        position: "top-right",
      });
    }
    if (!comment) {
      toast.error("Please add some comments ", {
        position: "top-right",
      });
    }
    const res = await axios
      .post(CREATE_REVIEW, payload)
      .then((data) =>
        toast.success(` Your Comment has been successfully added`, {
          position: "top-right",
        })
      )
      .catch((err) =>
        toast.error(err.response.data.message, {
          position: "top-right",
        })
      );
  };

  const deleteComments = async (id) => {
    if (showReviewImage) {
      for (let i = 0; i < showReviewImage.length; i++) {
        await reviewimageDeleteFromStorageApi(showReviewImage[i].file_name);
      }
    }
    const response = await axios.delete(`${DELETE_REVIEW}/${id}`);
    if (response.status === 200) {
      toast.success(`Your Comments successfully Deleted`, {
        position: "top-right",
      });
      Router.reload(window.location.pathname);
    }
  };

  const handleRemove = (cartItem) => {
    dispatch(removeFromCart(cartItem));
  };
  const handleAddToCart = (cartItem) => {
    dispatch(addToCart(cartItem));
  };
  const handleDecreaseCart = (cartItem) => {
    dispatch(decreaseCart(cartItem));
  };

  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
    };
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 ml-4 lg:mx-36">
              <div
                className="flex items-center justify-center p-7 flex-col-reverse md:flex-row"
                data-aos="fade-right"
                data-aos-duration="3000"
              >
                {/* <div className="hidden md:flex md:flex-row">side image</div> */}
                <ProductImageArray
                  images={imageArray}
                  tab={handleTab}
                  myRef={myRef}
                />
                <img
                  src={imageArray[index]}
                  style={{ width: "340px" }}
                  width={600}
                  height={450}
                  alt="image"
                />
              </div>
              <div data-aos="fade-left" data-aos-duration="3000" className="">
                <p className="flex items-center">
                  {" "}
                  <HiOutlineEye className="text-red-600" />{" "}
                  <span className="text-red-600 font-medium py-2 font-['Jost'] ml-2 text-lg">
                    37 guests
                  </span>{" "}
                  <span className="ml-2 font-medium font-['Jost'] text-lg py-2">
                    are viewing this product
                  </span>{" "}
                </p>
                <h3 className="text-4xl font-['Jost'] text-[#111111] mb-1 font-normal">
                  {product.name}
                </h3>
                <h5 className="text-4xl font-['Jost'] text-[#111111] mb-1 font-normal">
                  RS.{product.price}
                </h5>
                <div>
                  {/* <Rating star={2} text={`${totalReview} reviews`} /> */}
                  <Star stars={star} reviews={totalReview} />
                </div>

                {/* <p className="mt-2">Quantity</p> */}
                <div className="grid md:grid-cols-4">
                  {/* <div
                data-aos="zoom-out-left"
                data-aos-duration="3000"
                className="flex items-center px-3 py-6 my-4 border rounded-md border-[#ddd] text-base w-36 justify-between lg:mr-8 h-10"
              >
                <button
                  className="text-md font-bold w-5 h-4 mx-2"
                  onClick={() => handleDecreaseCart(product)}
                >
                  -
                </button>

                <button
                  className="text-md font-bold w-5 h-4 mx-3"
                  onClick={() => handleAddToCart(product)}
                >
                  +
                </button>
              </div> */}
                  {product.stockQuantity === 0 ? (
                    <p className="mt-7 text-red-500">Out of Stock</p>
                  ) : (
                    <>
                      <button
                        className="px-5 py-3 hover:bg-[#C8815F] transition duration-200 lg:ml-2 font-['Jost'] text-sm leading-[18px] font-bold rounded-md my-4 bg-black text-white mx-2"
                        onClick={() => handleAdd(product)}
                      >
                        Add to cart
                      </button>
                      <button className="px-5 py-3 lg:ml-2 font-['Jost'] text-sm leading-[18px] font-bold rounded-md my-4 bg-black text-white mx-2 hover:bg-[#C8815F] transition duration-200">
                        <Link
                          href={"/checkout-single-product/[id]"}
                          as={`/checkout-single-product/${product._id}`}
                        >
                          Buy Now
                        </Link>
                      </button>
                    </>
                  )}

                  <p
                    data-aos="zoom-out-left"
                    data-aos-duration="3000"
                    className="px-3 rounded-md py-3 my-4"
                    onClick={() => handleAddwishlist(product)}
                  >
                    <AiOutlineHeart className="w-6 h-6 cursor-pointer heart " />
                  </p>
                </div>
                <div className="flex flex-col xl:flex-row bg-[#FBFBF9] my-6 py-5 rounded items-start xl:items-center">
                  <p>Secure checkout with</p>
                  <Image
                    src={PaymentLogo}
                    width={300}
                    height={210}
                    alt="checkout method"
                    className="ml-0"
                  />
                </div>

                <p className="font-['Jost'] font-light my-3 text-[#555555] text-lg">
                  Free shipping over Rs.500
                </p>
                <p className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                  SKU:
                </p>
                <p className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                  Categories:{" "}
                  <span className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                    {product.category}
                  </span>{" "}
                </p>
                <p className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                  Left Item:{" "}
                  <span className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                    {product.stockQuantity}
                  </span>{" "}
                </p>
                <p className="font-normal font-['Jost'] my-3 text-[#555555] text-lg flex items-center">
                  Share:{" "}
                  <span className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                    <SocialShareComponents share_url={share_url} />
                  </span>{" "}
                </p>
                <p className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                  Description:{" "}
                  <span className="font-normal font-['Jost'] my-3 text-[#555555] text-lg">
                    {product.description}
                  </span>{" "}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <div className="font-['Jost'] text-2xl ml-28 my-11 mx-auto sm:mx-28 font-medium text-[#111]">
                <div>Product reviews & comments</div>
                <button
                  className="bg-green-400 text-white rounded-xl px-3 py-0.5 hover:bg-green-600"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Write Your review
                </button>
              </div>
              {/* <CommentSlider windowSize={screenSize.width}/> */}
              <div>
                {totalReview === 0 ? (
                  <div className="ml-7 my-5">No Reviews yet</div>
                ) : (
                  <>
                    <div className="flex justify-center items-center flex-wrap">
                      {reviewData
                        .map((review, index) => (
                          <>
                            <div className="ml-7 my-5">
                              <strong>{review.username}</strong>
                              <div>
                                {[...Array(5)].map((star, index) => {
                                  index += 1;
                                  return (
                                    <button
                                      // type="button"
                                      key={index}
                                      className={
                                        index <= review.star
                                          ? "on cursor-default font-bold"
                                          : "off cursor-default"
                                      }
                                    >
                                      <span className="star">
                                        <FaStar className="mx-1" />
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="-my-1">{review.comments}</p>
                              <p className="flex justify-center flex-wrap">
                                {review.review_images.map((image) => (
                                  <img
                                    key={image.image_url}
                                    src={image.image_url}
                                    alt={image.file_name}
                                    className="w-12 h-12 m-1"
                                  />
                                  ))}
                              </p>
                              {/* {review.review_images && review.review_images.map((item)=>{
                                return(
                                  <img key={item.image_url} src={item.image_url} alt="" />
                                )
                              })} */}
                              <p className="-my-1">
                                {review.createdAt.substring(0, 10)}
                              </p>
                              {userId === review.userId ? (
                                <>
                                  <button
                                    className="bg-red-600 text-white rounded-xl my-3 px-2 py-0.5 hover:bg-white hover:border hover:border-red-600 hover:text-red-600"
                                    onClick={() => deleteComments(review._id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : null}
                              {/* {userId === review.userId ? (
                                <>
                                  <button
                                    className="bg-green-400 text-white rounded-xl my-3 px-3 mx-2 py-0.5 hover:bg-green-600"
                                    onClick={() => openModalFetchData()}
                                  >
                                    Edit
                                  </button>
                                </>
                              ) : null} */}
                              <>
                                <Modal
                                  isVisible={updateShowModal}
                                  onClose={() => setUpdateShowModal(false)}
                                >
                                  <div className="flex justify-center items-center">
                                    {username ? (
                                      <form>
                                        <div>
                                          <h2>Update Your Review</h2>
                                        </div>
                                        <div>
                                          {[...Array(5)].map((star, index) => {
                                            index += 1;
                                            return (
                                              <button
                                                type="button"
                                                key={index}
                                                className={
                                                  index <=
                                                  (updateHover ||
                                                    updateRating ||
                                                    review.star)
                                                    ? "on font-extrabold"
                                                    : "off font-bold"
                                                }
                                                onClick={() =>
                                                  setUpdateRating(index)
                                                }
                                                onMouseEnter={() =>
                                                  setUpdateHover(index)
                                                }
                                                onMouseLeave={() =>
                                                  setUpdateHover(updateRating)
                                                }
                                              >
                                                <span className="star">
                                                  <FaStar className="mx-2" />
                                                </span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                        {/* <p className="flex justify-center flex-wrap">
                                {review.review_images.map((image) => (
                                  <img
                                    key={image.image_url}
                                    src={image.image_url}
                                    alt={image.file_name}
                                    className="w-12 h-12 m-1"
                                  />
                                  ))}
                              </p> */}

                              {review.review_images.length !== 0 ? (
            <div className="mt-0 flex w-full flex-wrap items-center justify-center gap-5 rounded-md">
              {showReviewImage && showReviewImage.map((file, index) => (
                <div key={index} className="relative mx-3 mt-1 mb-1">
                  <div className="rounded-md border-2 bg-white">
                    <img
                      src={file.image_url}
                      alt=""
                      className="mb-0 h-10 w-10 rounded-md border-0"
                    />
                  </div>
                  <div
                    type="button"
                    onClick={() => handleDeleteImages(file.file_name, file.id)}
                    className=""
                  >
                    <RxCross2 className="absolute -right-1 -top-1 rounded-full border-0 bg-white p-0.5 text-xl hover:bg-rose-600 hover:text-white" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
                                        <ImageInput onFileChanges={handleImages} />
                                        <label htmlFor="comment">Comment</label>
                                        <div>
                                          <textarea
                                            id="comment"
                                            value={
                                              updateComment || review.comments
                                            }
                                            className="border"
                                            onChange={(e) =>
                                              setUpdateComment(e.target.value)
                                            }
                                          ></textarea>
                                        </div>

                                        <div>
                                          <label />
                                          <button
                                            className="bg-green-300 text-white rounded-xl px-2 py-2 hover:bg-green-600"
                                            type="submit"
                                            onClick={() => onSubmit(review._id)}
                                          >
                                            Submit
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <>
                                        Please{" "}
                                        <Link
                                          className="text-red-500 font-semibold mx-2"
                                          href="/login"
                                        >
                                          Login
                                        </Link>{" "}
                                        to add a comments
                                      </>
                                    )}
                                  </div>
                                </Modal>
                              </>
                            </div>
                          </>
                        ))
                        .slice(0, 6)}
                    </div>
                  </>
                )}
              </div>

              {userId ? (
                <>
                  <Modal
                    isVisible={showModal}
                    onClose={() => setShowModal(false)}
                  >
                    <div className="flex justify-center items-center">
                      {username ? (
                        <form className="form" onSubmit={submitHandler}>
                          <div>
                            <h2>Write your review</h2>
                          </div>
                          <div>
                            {[...Array(5)].map((star, index) => {
                              index += 1;
                              return (
                                <button
                                  type="button"
                                  key={index}
                                  className={
                                    index <= (hover || rating)
                                      ? "on font-extrabold"
                                      : "off font-bold"
                                  }
                                  onClick={() => setRating(index)}
                                  onMouseEnter={() => setHover(index)}
                                  onMouseLeave={() => setHover(rating)}
                                >
                                  <span className="star">
                                    <FaStar className="mx-2" />
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <ImageInput onFileChanges={handleImages} />
                          <label htmlFor="comment">Comment</label>
                          <div>
                            <textarea
                              id="comment"
                              value={comment}
                              className="border"
                              onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                          </div>

                          <div>
                            <label />
                            <button
                              className="bg-green-300 text-white rounded-xl px-2 py-2 hover:bg-green-600"
                              type="submit"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          Please{" "}
                          <Link
                            className="text-red-500 font-semibold mx-2"
                            href="/login"
                          >
                            Login
                          </Link>{" "}
                          to add a comments
                        </>
                      )}
                    </div>
                  </Modal>
                </>
              ) : null}
            </div>
            <div className="mt-6">
              <div className="font-['Jost'] text-2xl ml-28 my-11 mx-auto sm:mx-28 font-medium text-[#111]">
                Related Products
              </div>
            </div>
            <div
              className="container mx-auto "
              data-aos="fade-up"
              data-aos-duration="4000"
            >
              <div className="grid items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-sm mx-auto md:max-w-none md:mx-auto justify-between">
                {allproduct.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export async function getServerSideProps({ params: { id } }) {
  let loading = false;
  const res = await fetch(`${FETCH_SINGLE_PRODUCT}/${id}`);
  const alldata = await fetch(`${FETCH_ALL_PRODUCT}`);
  const review = await fetch(`${FETCH_REVIEW}/${id}`);
  const imageRes = await fetch(`${GET_PRODUCT_IMAGE}/${id}`);

  const imageData = await imageRes.json();

  const newReview = await review.json();
  const some = newReview.data;
  const data = await res.json();
  if (!data) {
    loading(true);
  }
  const relProduct = await alldata.json();
  const filterData = relProduct.filter(
    (item) => item.category === data.category
  );
  return {
    props: {
      product: data,
      allproduct: filterData,
      totalReview: some.length,
      reviewData: some,
      loading: loading,
      imageData: imageData.data,
    },
  };
}

export default Product;
