const users = [];

const addUser = ({ id, name, room }) => {
  // TODO: lower case
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id: id, name: name, room: room };

  users.push(user);

  return { user: user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]; // get and remove user from users
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUserInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUserInRoom };
