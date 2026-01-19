import './ProductOnSalePreview.css';

export default function ProductOnSalePreview({ title, editor, price, img }) {
    return (
        <div className='product-on-sale-preview-container'>
            <img className='product-on-sale-preview-img'
                src={img} alt='preview img'
            />
            <div className='product-on-sale-detail-info-wrapper'>
                <span className='product-on-sale-title'>{title}</span>
                <div className='product-on-sale-editor-and-price-wrapper'>
                    <span className='product-on-sale-editor'>edit.{editor}</span>
                    <span className='product-on-sale-price'>{Number(price).toLocaleString()}원</span>
                </div>
            </div>
        </div>
    );
}