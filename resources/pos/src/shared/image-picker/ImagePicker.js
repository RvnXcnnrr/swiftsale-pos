import React from 'react';
import {getFormattedMessage, placeholderText} from '../sharedMethod';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const ImagePicker = (props) => {
    const {imagePreviewUrl, handleImageChange, imageTitle, avtarName, user, handleDeleteImage} = props;
    let fileInput = React.createRef();

    return (
        <div className='col-12'>
            <label
                className='form-label mb-4'>{imageTitle ? imageTitle : getFormattedMessage('globally.input.change-logo.tooltip')}:
            </label>
            <div className='d-block'>
                <div
                    className='image-picker'>
                    <div
                        className={`image previewImage imagePreviewUrl ${imagePreviewUrl ? null : "d-flex justify-content-center align-items-center"}`}
                        style={{position: 'relative'}}>
                        {imagePreviewUrl ?
                            <img src={imagePreviewUrl ? imagePreviewUrl : null} alt='img' width={75}
                                 height={100} className='image image-circle image-mini h-100'/>
                            : avtarName ?
                                <span className='custom-user-avatar w-100 h-100'>{avtarName}</span>
                                :
                                <img src={user ? user : null} alt='img' width={75} height={75}
                                     className='image image-circle image-mini h-100'/>
                        }
                        <span
                            className='picker-edit rounded-circle text-gray-500 fs-small cursor-pointer'>
                                <input
                                    className='upload-file'
                                    title={`${imageTitle ? imageTitle : placeholderText('globally.input.change-logo.tooltip')}`}
                                    type='file'
                                    accept='.png, .jpg, .jpeg'
                                    onChange={(e) => handleImageChange(e)}
                                    ref={fileInput}
                                />
                                <FontAwesomeIcon icon={faPencil}/>
                            </span>
                        {imagePreviewUrl && handleDeleteImage && (
                            <span
                                className='picker-delete rounded-circle text-danger fs-small cursor-pointer'
                                onClick={handleDeleteImage}
                                title={placeholderText('globally.input.delete-image.tooltip')}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    backgroundColor: 'white',
                                    width: '25px',
                                    height: '25px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #dc3545',
                                    zIndex: 1
                                }}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>)
}

export default ImagePicker;

