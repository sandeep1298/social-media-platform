import {
  Box,
  Button,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { Edit3, UserMinus, UserPlus } from "lucide-react";
import UserAvatar from "./UserAvatar";

export default function ProfileHeader({
  currentUserId,
  isFollowLoading,
  onEdit,
  onFollow,
  onUnfollow,
  postsCount = 0,
  user
}) {
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const muted = useColorModeValue("gray.500", "gray.400");
  const isOwnProfile = currentUserId === user?._id;
  const isFollowing = (user?.followers || []).map((id) => id?.toString()).includes(currentUserId);

  return (
    <Box borderBottomWidth="1px" borderColor={borderColor} pb={6}>
      <Stack direction={{ base: "column", md: "row" }} spacing={{ base: 5, md: 8 }} align={{ base: "flex-start", md: "center" }}>
        <UserAvatar user={user} size="2xl" />
        <Stack flex="1" spacing={4}>
          <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }}>
            <Box>
              <Text fontSize="2xl" fontWeight="900">
                {user?.name}
              </Text>
              <Text color={muted}>@{user?.username || "creator"}</Text>
            </Box>
            {isOwnProfile ? (
              <Button leftIcon={<Edit3 size={18} />} variant="outline" onClick={onEdit}>
                Edit Profile
              </Button>
            ) : isFollowing ? (
              <Button leftIcon={<UserMinus size={18} />} variant="outline" isLoading={isFollowLoading} onClick={onUnfollow}>
                Unfollow
              </Button>
            ) : (
              <Button leftIcon={<UserPlus size={18} />} isLoading={isFollowLoading} onClick={onFollow}>
                Follow
              </Button>
            )}
          </Stack>
          <SimpleGrid columns={3} maxW="420px" spacing={3}>
            <Stat>
              <StatNumber fontSize="xl">{postsCount}</StatNumber>
              <StatLabel>Posts</StatLabel>
            </Stat>
            <Stat>
              <StatNumber fontSize="xl">{user?.followersCount || user?.followers?.length || 0}</StatNumber>
              <StatLabel>Followers</StatLabel>
            </Stat>
            <Stat>
              <StatNumber fontSize="xl">{user?.followingCount || user?.following?.length || 0}</StatNumber>
              <StatLabel>Following</StatLabel>
            </Stat>
          </SimpleGrid>
          {user?.bio ? <Text>{user.bio}</Text> : <Text color={muted}>No bio yet.</Text>}
        </Stack>
      </Stack>
    </Box>
  );
}
