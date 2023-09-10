/* eslint-disable max-len */
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
// import { useCookies, Cookies } from 'react-cookie';
import levelNumberToString from '../../../utils/levelNumberToString';
import axiosInstance from '../../../services/axiosInstance';
import capitalize from '../../../utils/capitalize';
import type { Sport, OwnRating } from '../../types';
import AuthContext from '../../../context/AuthContext';
import OriginAvatarUrl from '../../../utils/originAvatarUrl';

interface ProfileInfosInterface {
username : string;
avatar : string;
sports : Sport[];
ownRating : OwnRating[];
}

function ProfileInfo({
 username, avatar, sports, ownRating,
} : ProfileInfosInterface) {
const { setIsAuth } = useContext(AuthContext);
const [sportChosen, setSportChosen] = useState<'Football' | 'BasketBall'>('Football');
// const [cookie, removeCookie] = useCookies(['user']);

const handleClickLogout = async () => {
    setIsAuth(false);
    await axiosInstance.post('/logout');
};

const handleChangeSport = (e) => {
setSportChosen(e.target.value);
};

// Function to convert the number of the level to a string IF the user has MORE THAN ONE rating
const displayCurrentSport = (arraySport : Sport[]) : string => {
const currentSport = arraySport
  .find((sport) => sport.name.toLowerCase() === sportChosen.toLowerCase());
const convertedRating = levelNumberToString(currentSport?.gb_rating);
return convertedRating;
};

// Function to convert the number of the level to a string IF the user has NO rating, but has HIS OWN rating
const displayOwnRating = (arrayOwnRating : OwnRating[]) : string => {
  const currentSport = arrayOwnRating
    .find((sport) => sport.name.toLowerCase() === sportChosen.toLowerCase());
  const convertedRating = levelNumberToString(currentSport?.rating);
  return convertedRating;
  };

  return (
    // ProfileInfo container
    <div className="flex flex-col h-content gap-4 pb-4 px-5 m-auto w-full h-80 shadow-xs border border-base-300 rounded-xl mb-2 bg-neutral-focus sm:mb-0 sm:w-1/2">
      <div className="flex flex-col items-center justify-between w-full">

        {/* Avatar and username container */}
        <div className="flex items-center gap-6 p-4 sm:self-start">
          <div className="avatar">
            <div className="w-14 rounded-full">
              <img
                src={OriginAvatarUrl(avatar)}
                alt={`${username} avatar`}
              />
            </div>
          </div>
          { username && (<h1 className="text-3xl font-semibold">{capitalize(username)}</h1>)}
        </div>

        {/* Link to edit profile and logout */}
        <div className="px-4 flex justify-center sm:self-end">
          <Link to="/edit_profile">
            <button type="button" className="btn btn-ghost border-gray-500 btn-xs m-2">Edit profile</button>
          </Link>
          <button type="button" className="btn btn-ghost border-gray-500 btn-xs m-2" onClick={handleClickLogout}>Logout</button>
        </div>
      </div>

      {/* Level info container */}
      <div className="w-full h-full flex flex-col justify-evenly items-center gap-4">
        <div className="form-control w-full px-4 gap-4">
          <label className="label-text text-xl font-semibold" htmlFor="sport">Check your level</label>
          <select className="select select-bordered select-sm" onChange={handleChangeSport} defaultValue={sportChosen}>
            {/* <option disabled selected>{sportChosen}</option> */}
            <option>Football</option>
            <option>Basketball</option>
          </select>
        </div>
        {(sports) && (
        <div className="text-xl text-base bg-neutral-focus rounded-xl shadow-md p-5 font-bold">

          {/* If global rating is null => ownRating is chosen instead */}
          {(sports[0].gb_rating !== null && sports[1].gb_rating !== null)
            ? displayCurrentSport(sports)
            : displayOwnRating(ownRating)}
        </div>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
