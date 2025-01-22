import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
  modalMode,
  tempProduct,
  isProductModalOpen,
  setIsProductModalOpen,
  getProducts,
}) {
  // 防止直接修改外部傳入的 tempProduct，設定一個內部的 modalData 狀態
  const [modalData, setModalData] = useState(tempProduct);

  // ============================= 【產品modal】 =============================
  // 開啟【產品modal】
  useEffect(() => {
    if (isProductModalOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isProductModalOpen]);

  // 關閉【產品modal】
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    setIsProductModalOpen(false);
  };

  // tempProduct更新時，更新 modalData
  useEffect(() => {
    setModalData({
      ...tempProduct,
    });
  }, [tempProduct]);

  // ================================ 產品操作 ================================
  // 【新增產品】(帶入modalData)
  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/admin/product`, {
        data: {
          ...modalData,
          origin_price: Number(modalData.origin_price),
          price: Number(modalData.price),
          is_enabled: modalData.is_enabled ? 1 : 0,
        },
      });
    } catch (error) {
      alert("新增產品失敗");
    }
  };

  // 【編輯產品】(帶入modalData)
  const updateProduct = async () => {
    try {
      await axios.put(
        `${BASE_URL}/v2/api/${API_PATH}/admin/product/${modalData.id}`,
        {
          data: {
            ...modalData,
            origin_price: Number(modalData.origin_price),
            price: Number(modalData.price),
            is_enabled: modalData.is_enabled ? 1 : 0,
          },
        }
      );
    } catch (error) {
      alert("編輯產品失敗");
    }
  };

  const productModalRef = useRef(null); //取得產品Modal的DOM;

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false, //點擊背景關閉modal功能，取消
    });
  }, []);

  // 【Modal表單內部 input 的變更】-------------------------------------------------
  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target; //取得input的value,name
    setModalData({
      ...modalData,
      [name]: type === "checkbox" ? checked : value, //覆蓋掉modalData的內容(判斷為核取方塊時改傳入checked)
    });
  };

  // ========================================= 圖片 =========================================
  // 副圖網址的input，輸入網址可替換圖片
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...modalData.imagesUrl]; //取得圖片data(避免附蓋元陣列)
    newImages[index] = value; // 指定哪張圖片進行替換
    setModalData({
      ...modalData,
      imagesUrl: newImages, //更新過後的imagesUrl直接覆蓋
    });
  };

  // 新增附圖
  const handleAddImage = () => {
    const newImages = [...modalData.imagesUrl, ""]; //""新增空的欄位
    setModalData({
      ...modalData,
      imagesUrl: newImages, //更新後覆蓋
    });
  };

  // 取消附圖
  const handleRemoveImage = () => {
    const newImages = [...modalData.imagesUrl];
    newImages.pop(); // 移除最後一個圖片欄位
    setModalData({
      ...modalData,
      imagesUrl: newImages, //更新後覆蓋
    });
  };

  // 上傳圖片(主圖)
  const handleFileChange = async (e) => {
    const file = e.target.files[0]; //取得選擇的檔案
    const formData = new FormData();
    formData.append("file-to-upload", file); //將檔案加入表單資料中
    try {
      const res = await axios.post(
        `${BASE_URL}/v2/api/${API_PATH}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl; //上傳成功後取得圖片 URL
      setModalData({
        ...modalData,
        imageUrl: uploadedImageUrl, //覆蓋主圖
      });
    } catch (error) {
      console.log("上傳圖片失敗");
    }
  };

  // 呼叫【新增產品】or【編輯產品】--------------------------------------------------
  const handleUpdateProduct = async () => {
    const apiCall = modalMode === "create" ? createProduct : updateProduct;
    try {
      await apiCall(); //呼叫對應的API函式
      getProducts(); //取得產品資料(重新渲染表單)
      handleCloseProductModal(); //關閉modal
    } catch (error) {
      alert("更新產品失敗");
    }
  };

  return (
    <div
      ref={productModalRef}
      id="productModal"
      className="modal"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fs-4">
              {modalMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              onClick={handleCloseProductModal}
              type="button"
              className="btn-close"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="mb-4">
                  {/* 圖片上傳 */}
                  <div className="mb-5">
                    <label htmlFor="fileInput" className="form-label">
                      {" "}
                      圖片上傳{" "}
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="form-control"
                      id="fileInput"
                      onChange={handleFileChange}
                    />
                  </div>
                  {/* 主圖 */}
                  <label htmlFor="primary-image" className="form-label">
                    主圖
                  </label>
                  <div className="input-group">
                    <input
                      value={modalData.imageUrl}
                      onChange={handleModalInputChange}
                      name="imageUrl"
                      type="text"
                      id="primary-image"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.title}
                    className="img-fluid"
                  />
                </div>
                {/* 副圖 */}
                <div className="border border-2 border-dashed rounded-3 p-3">
                  {modalData.imagesUrl?.map((image, index) => (
                    <div key={index} className="mb-2">
                      <label
                        htmlFor={`imagesUrl-${index + 1}`}
                        className="form-label"
                      >
                        副圖 {index + 1}
                      </label>
                      <input
                        value={image}
                        onChange={(e) => handleImageChange(e, index)}
                        id={`imagesUrl-${index + 1}`}
                        type="text"
                        placeholder={`圖片網址 ${index + 1}`}
                        className="form-control mb-2"
                      />
                      {image && (
                        <img
                          src={image}
                          alt={`副圖 ${index + 1}`}
                          className="img-fluid mb-2"
                        />
                      )}
                    </div>
                  ))}
                  {/* 新增、取消圖片 */}
                  <div className="btn-group w-100">
                    {/* 按鈕 → 新增圖片 (當附圖圖片張數小於5 && 最後一張有值時) */}
                    {modalData.imagesUrl.length < 5 &&
                      modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                        "" && (
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={handleAddImage}
                        >
                          新增圖片
                        </button>
                      )}
                    {/* 按鈕 → 取消圖片 (若有至少一張圖片) */}
                    {modalData.imagesUrl.length > 1 && (
                      <button
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={handleRemoveImage}
                      >
                        取消圖片
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    value={modalData.title}
                    onChange={handleModalInputChange}
                    name="title"
                    id="title"
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    value={modalData.category}
                    onChange={handleModalInputChange}
                    name="category"
                    id="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    value={modalData.unit}
                    onChange={handleModalInputChange}
                    name="unit"
                    id="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      value={modalData.origin_price}
                      onChange={handleModalInputChange}
                      name="origin_price"
                      id="origin_price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入原價"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      value={modalData.price}
                      onChange={handleModalInputChange}
                      name="price"
                      id="price"
                      type="number"
                      className="form-control"
                      placeholder="請輸入售價"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    value={modalData.description}
                    onChange={handleModalInputChange}
                    name="description"
                    id="description"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入產品描述"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    value={modalData.content}
                    onChange={handleModalInputChange}
                    name="content"
                    id="content"
                    className="form-control"
                    rows={4}
                    placeholder="請輸入說明內容"
                  ></textarea>
                </div>

                <div className="form-check">
                  <input
                    checked={modalData.is_enabled} //checked才是判斷狀態
                    onChange={handleModalInputChange}
                    name="is_enabled"
                    type="checkbox"
                    className="form-check-input"
                    id="isEnabled"
                  />
                  <label className="form-check-label" htmlFor="isEnabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer border-top bg-light">
            <button
              onClick={handleCloseProductModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleUpdateProduct}
              type="button"
              className="btn btn-primary"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductModal;
