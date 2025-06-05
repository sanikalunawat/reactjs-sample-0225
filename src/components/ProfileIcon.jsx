import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileIcon = () => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchProfileIcon = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      let profileId;

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().profilePicId !== undefined) {
          profileId = userSnap.data().profilePicId;
        } else {
          profileId = Math.floor(Math.random() * 1000); // 0-999
          await setDoc(userRef, { profilePicId: profileId }, { merge: true });
        }
        setImageUrl(`https://picsum.photos/id/${profileId}/40/40`);
      } catch (err) {
        setImageUrl('https://dummyimage.com/40x40/cccccc/ffffff&text=+');
      }
    };

    fetchProfileIcon();
  }, []);

  return (
    <div className="profile-icon">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://dummyimage.com/40x40/cccccc/ffffff&text=+';
          }}
        />
      )}
    </div>
  );
};

export default ProfileIcon;