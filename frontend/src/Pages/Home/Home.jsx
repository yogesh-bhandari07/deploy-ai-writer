import React, { useRef, useState } from "react";
import axios from "axios";
import Notification, {
  successNotify,
  errorNotify,
} from "../../Services/Notification";
import Loading from "../../Components/Loading/Loading";
import { CopyToClipboard } from "react-copy-to-clipboard";
function Home() {
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [responseData, setResponseData] = useState("");

  const handleTitleInput = (e) => {
    setEditorData(e.target.value);
  };
  const handleResponseInput = (e) => {
    setResponseData(e.target.value);
  };

  const createContent = async (url) => {
    setLoading(true);
    await axios({
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + url,
      data: {
        title: editorData,
      },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200) {
          setResponseData(response.data.content);
        }
      })
      .catch((response) => {
        setLoading(false);
        // console.log(response)
        if (response.response.status == 404) {
          response.response.data.errors.non_field_errors.map((error) =>
            errorNotify(error)
          );
        }
        if (response.response.status == 401) {
          errorNotify(response.response.data.errors.message);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createContent("content-create");
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex justify-center align-middle h-screen w-[98vw]  p-6 mt-14">
      <div className=" bg-[#EFF5F5] w-[600px] h-fit p-4 rounded ">
        <p className="text-2xl text-[#404258] font-bold my-2">
          Post Informations
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={handleTitleInput}
            value={editorData}
            id="message"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."
          ></textarea>

          <center>
            <button
              type="submit"
              className="mt-2 bg-[#497174] text-white py-2 px-3 rounded"
            >
              Next
            </button>
          </center>
        </form>

        <div className="responseDiv mt-4 flex flex-col">
          <textarea
            onChange={handleResponseInput}
            value={responseData}
            id="message"
            disabled={responseData == "" ? true : false}
            rows="20"
            cols="20"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Response..."
          ></textarea>

          <center>
            <CopyToClipboard onCopy={() => setCopy(!copy)} text={responseData}>
              <button
                disabled={copy ? true : false}
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-4"
              >
                Copy To ClipBoard
              </button>
            </CopyToClipboard>
          </center>
        </div>
      </div>
      <Notification></Notification>
    </div>
  );
}

export default Home;
