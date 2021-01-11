import { avatarList } from '../components/images';

const correctCoordinates = (val, bounds) => {
  if (val < -1 * bounds || val > bounds) {
    return (val + bounds) % bounds;
  }
  return val;
};

const createFakeUsers = (numUsers, { lat, lng }, ratio) => {
  return [...Array(numUsers)].fill(0).map((val, index) => ({
    _id: index,
    lat: correctCoordinates(
      lat +
        ratio * index * Math.sin((Math.PI * index) / 180) * Math.cos((23 * Math.PI * index) / 180) +
        Math.sin(index / 180),
      80
    ),
    lng: correctCoordinates(
      lng +
        ratio *
          index *
          Math.cos((17 * Math.PI * index) / 180) *
          Math.sin((5 * Math.PI * index) / 180) +
        Math.sin(index / 180),
      180
    ),
    avatar: avatarList[(avatarList.length * Math.random()) << 0],
    username: 'User' + index.toString(10),
    latestMessage: Math.random() < 0.5 ? 'Hello World!' : undefined,
  }));
};

export default createFakeUsers;
