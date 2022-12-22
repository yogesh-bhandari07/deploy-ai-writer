import React, { useState } from "react";
import Notification, {
  successNotify,
  errorNotify,
} from "../../Services/Notification";
import Loading from "../../Components/Loading/Loading";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoMdAdd } from "react-icons/io";
import { RiAddLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineMinus } from "react-icons/ai";
import HomeImg from "../../Assets/images/Home.gif";
import axios from "axios";
function NewHome() {
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [responseData, setResponseData] = useState("");
  const [editorData, setEditorData] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [titles, setTitles] = useState([]);
  const [selectedTitles, setSelectedTitle] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const handleTitleInput = (e) => {
    setEditorData(e.target.value);
  };
  const handleResponseInput = (e) => {
    setResponseData(e.target.value);
  };

  const createContent = async (url) => {
    setLoading(true);
    editorData.replace("write an article", "");
    let s = "";
    if (selectedTitles.length != 0 && keywords.length != 0 && selectedTitles != undefined && keywords != undefined) {
      let ts = selectedTitles.join();
      let kw = keywords.join();
      s =
        "write articles on these topics " +
        editorData +
        ", " +
        ts +
        " included these keywords " +
        kw;
    } else if (selectedTitles.length != 0 && selectedTitles !=undefined) {
      let ts = selectedTitles.join();
      s = "write articles on these topics " + editorData + ", " + ts;
    } else if (keywords != undefined) {
      let kw = keywords.join();
      s = "write article on " + editorData + " included these keywords " + kw;
    } else {
      s = "write an article on " + editorData;
    }
    await axios({
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + url,
      data: {
        title: s,
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

  const getListOfTitles = async (url) => {
    setLoading(true);

    let s = "create only titles with these keywords ";
    let kwords = keywords.join();
    s = s + kwords;

    await axios({
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + url,
      data: {
        title: s,
      },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.status == 200) {
          // setResponseData(response.data.content);
          setTitles(response.data.content);
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
    e.preventDefault()
    if (e.charCode != 13 && e.keyCode != 13) {
      createContent("content-create");
    } 
  };

  const handleKeywordInput = (e) => {
    setKeywordInput(e.target.value);
  };

  const handleAddKeyword = (e) => {
    if (e.charCode == 13) {
      setKeywords([...keywords, e.target.value]);
      setKeywordInput("");
    }
    if (e.keyCode == 13) {
      setKeywords([...keywords, e.target.value]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (index) => {
    delete keywords[index];
    setKeywords([...keywords]);
  };
  const handleGetTitle = () => {
    if (keywords.length != 0) {
      getListOfTitles("titles-create");
    } else {
      errorNotify("Please Enter Keywords First!");
    }
  };

  const handleAddTitles = (title) => {
    setSelectedTitle([...selectedTitles, title]);
  };
  const handleRemoveSelectedTitles = (index) => {
    delete selectedTitles[index];
    setSelectedTitle([...selectedTitles]);
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow  lg:max-w-lg lg:w-full md:w-1/2 w-5/6 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <div
              className="w-full"
           
            >
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Title
                </label>

                <textarea
                  value={editorData}
                  onChange={handleTitleInput}
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Keywords (<small>Optional</small>)
                </label>

                <input
                  type="text"
                  id="keywordInputBox"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Keyword"
                  onKeyDown={handleAddKeyword}
                  onChange={handleKeywordInput}
                  value={keywordInput}
                />

                {keywords.length != 0
                  ? keywords.map((keyword, i) =>
                      keyword != undefined ? (
                        <button
                          key={i}
                          onClick={() => {
                            removeKeyword(i);
                          }}
                          type="button"
                          className="mx-2 inline-flex items-center px-2 py-1.5 text-sm font-medium text-center text-black bg-[#DEF5E5] rounded-lg  focus:ring-4 focus:outline-none  mt-2"
                        >
                          {keyword}
                          <span className="bg-[#FF7D7D] hover:bg-red-800 text-white text-sm font-bold inline-flex items-center p-1.5 rounded-full  ml-2">
                            <RxCross2 className="text-bold " />
                          </span>
                        </button>
                      ) : (
                        ""
                      )
                    )
                  : ""}

              {keywords.length != 0?<center>
                  <button
                    onClick={handleGetTitle}
                    type="button"
                    className="bg-[#C6EBC5] px-1 py-1 mx-1 rounded-sm ring-2 ring-green-300 w-[10rem] mt-4"
                  >
                    Get Titles
                  </button>
                </center>:''
            }
              </div>

              <div className="mb-6 w-full">
                {titles.length != 0 ? (
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Titles
                  </label>
                ) : (
                  ""
                )}

                <ul className="menu bg-base-100 w-full p-2 rounded-box border-1   ">
                  {titles.length != 0
                    ? titles.map((title, i) =>
                        title != undefined ? (
                          <li
                            className="flex flex-row items-center ring-2 ring-gray-300 w-full "
                            key={title.id}
                            id={title.id}
                          >
                            <a className="hover:bg-white w-[90%]">
                              {!selectedTitles.includes(title.value) ? (
                                <AiOutlineMinus />
                              ) : (
                                <TiTick />
                              )}

                              {title.value}
                            </a>
                            {!selectedTitles.includes(title.value) ? (
                              <button
                                onClick={() => {
                                  handleAddTitles(title.value);
                                }}
                                type="button"
                                className="ml-auto text-black bg-[#DEF5E5] font-medium rounded-lg text-sm p-1.5 h-fit text-center inline-flex items-center mr-2 "
                              >
                                <IoMdAdd />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleRemoveSelectedTitles(i);
                                }}
                                type="button"
                                className="ml-auto text-white bg-red-700 font-medium rounded-lg text-sm p-1.5 h-fit text-center inline-flex items-center mr-2 "
                              >
                                <RxCross2 />
                              </button>
                            )}
                          </li>
                        ) : (
                          ""
                        )
                      )
                    : ""}
                </ul>
              </div>
              <center>
                <button
                onClick={handleSubmit}
                  type="button"
                  className="bg-[#3F4E4F] py-2.5 px-2 text-white rounded-lg"
                >
                  Submit
                </button>
              </center>
            </div>
          </div>
          <div className="lg:w-full  md:w-1/2 h-[80vh] ring-2 ring-gray-300 rounded-lg  justify-center items-center p-4 flex flex-col">
            {responseData == "" ? (
              <img src={HomeImg} alt="" />
            ) : (
              <textarea
                onChange={handleResponseInput}
                value={responseData}
                id="message"
                disabled={responseData == "" ? true : false}
                rows="20"
                cols="20"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-full w-full"
                placeholder="Response..."
              ></textarea>
            )}
            {responseData != "" ? (
              <center>
                <CopyToClipboard
                  onCopy={() => setCopy(!copy)}
                  text={responseData}
                >
                  <button
                    disabled={copy ? true : false}
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-4"
                  >
                    Copy To ClipBoard
                  </button>
                </CopyToClipboard>
              </center>
            ) : (
              ""
            )}
          </div>
        </div>

        <Notification></Notification>
      </section>
    </div>
  );
}

export default NewHome;
