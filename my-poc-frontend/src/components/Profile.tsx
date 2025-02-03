import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import { API_ENDPOINTS } from '../config/api';

interface ProfileProps {
    microsoftId: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    onUpdate: (updatedUser: { name: string; email: string; phone: string; avatarUrl: string }) => void;
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ 
    microsoftId, 
    name, 
    email, 
    phone, 
    avatarUrl, 
    onUpdate, 
    onLogout 
}) => {
    const [editName, setEditName] = useState(name);
    const [editEmail, setEditEmail] = useState(email);
    const [editPhone, setEditPhone] = useState(phone);
    const [editAvatar, setEditAvatar] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [updateStatus, setUpdateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Reset form when props change
    useEffect(() => {
        setEditName(name);
        setEditEmail(email);
        setEditPhone(phone);
        setPreviewAvatar(null);
    }, [name, email, phone]);

    const handleUpdate = async () => {
        if (!microsoftId?.trim()) {
            alert('Invalid session. Please log in again.');
            onLogout();
            return;
        }

        setUpdateStatus('loading');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('microsoftId', microsoftId);
        formData.append('name', editName.trim());
        formData.append('email', editEmail.trim());
        formData.append('phone', editPhone.trim());
        if (editAvatar) {
            formData.append('avatar', editAvatar);
        }

        try {
            const response = await axios.put(API_ENDPOINTS.profile, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (response.data.success) {
                const updatedUser = {
                    name: response.data.user.displayName,
                    email: response.data.user.email,
                    phone: response.data.user.phone,
                    avatarUrl: response.data.user.avatarUrl
                };
                
                onUpdate(updatedUser);
                setUpdateStatus('success');
                setTimeout(() => setUpdateStatus('idle'), 3000);
            }
        } catch (error: any) {
            console.error('Profile update error:', error);
            setUpdateStatus('error');
            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                'Failed to update profile. Please try again.'
            );
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setEditAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const isValidForm = () => {
        return editName.trim() && 
               editEmail.trim() && 
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">User Profile</h2>
                
                <div className="avatar-section">
                    {previewAvatar ? (
                        <img 
                            src={previewAvatar} 
                            alt="Avatar preview" 
                            className="avatar-preview"
                        />
                    ) : (
                        <div className="avatar-placeholder">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <label className="avatar-upload-label">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="avatar-upload-input"
                        />
                        Change Avatar
                    </label>
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            disabled={updateStatus === 'loading'}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            disabled={updateStatus === 'loading'}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            placeholder="Enter phone number"
                            disabled={updateStatus === 'loading'}
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            className={`update-button ${updateStatus === 'loading' ? 'loading' : ''}`}
                            onClick={handleUpdate}
                            disabled={!isValidForm() || updateStatus === 'loading'}
                        >
                            {updateStatus === 'loading' ? 'Updating...' : 'Update Profile'}
                        </button>

                        <button 
                            className="logout-button"
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>

                    {updateStatus === 'success' && (
                        <div className="status-message success">
                            ✔ Profile updated successfully!
                        </div>
                    )}

                    {updateStatus === 'error' && (
                        <div className="status-message error">
                            ⚠ {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;