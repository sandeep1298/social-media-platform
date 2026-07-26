import { Avatar } from "@chakra-ui/react";

export default function UserAvatar({ user, size = "md" }) {
  return (
    <Avatar
      name={user?.name || user?.username || "User"}
      src={user?.profilePic || ""}
      size={size}
      bg="brand.500"
      color="white"
      borderWidth="1px"
      borderColor="whiteAlpha.400"
    />
  );
}
