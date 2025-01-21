import { useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


function DeleteProductModal({getProducts,isDelProductModalOpen,setIsDelProductModalOpen,tempProduct}) {
    const delProductModalRef = useRef(null); //綁定刪除按鈕DOM

    // 渲染後再取得DOM變數
    useEffect(() => {
        new Modal(delProductModalRef.current, {
        backdrop: false, //點擊背景關閉modal功能，取消
        });
    }, []);

    // 開啟【刪除Modal】
    useEffect(()=>{
        if(isDelProductModalOpen){
            const modalInstance = Modal.getInstance(delProductModalRef.current);
            modalInstance.show();
        }
        setIsDelProductModalOpen(false);
    },[isDelProductModalOpen])
    
    // 關閉【刪除modal】
    const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    };

    // 【刪除產品】
    const deleteProduct = async () => {
        try {
        await axios.delete(
            `${BASE_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`
        );
        } catch (error) {
        alert("刪除產品失敗");
        }
    };

    // 呼叫【刪除產品】
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(); //呼叫刪除產品
            getProducts(); //取得產品資料
            handleCloseDelProductModal(); //關閉【刪除modal】
        } catch (error) {
            alert("刪除產品失敗QQ");
        }
    };
    return (
        <div
        ref={delProductModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5">刪除產品</h1>
                <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
                你是否要刪除
                <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
                <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn btn-secondary"
                >
                取消
                </button>
                <button
                onClick={handleDeleteProduct}
                type="button"
                className="btn btn-danger"
                >
                刪除
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
export default DeleteProductModal;
