import {
  Box,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { Search as SearchIcon, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router";
import EmptyState from "../components/EmptyState";
import FeedSkeleton from "../components/FeedSkeleton";
import PageTransition from "../components/PageTransition";
import PostCard from "../components/PostCard";
import UpdateModal from "../components/UpdateModal";
import UserAvatar from "../components/UserAvatar";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { useSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";
import { getErrorMessage } from "../services/api";

const sortOptions = [
  { label: "Recent", value: "recent" },
  { label: "Oldest", value: "oldest" },
  { label: "Newest", value: "newest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" }
];

export default function Search() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [selectedPost, setSelectedPost] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const debouncedQuery = useDebounce(query, 350);
  const searchQuery = useSearch({ q: debouncedQuery, sort });
  const { commentMutation, deletePostMutation, likePostMutation, unlikePostMutation, updatePostMutation } = usePosts({ q: debouncedQuery, sort });
  const result = searchQuery.data || { posts: [], users: [] };
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const muted = useColorModeValue("gray.500", "gray.400");

  const hasResults = useMemo(() => result.posts.length > 0 || result.users.length > 0, [result.posts.length, result.users.length]);

  const openPostEdit = useCallback(
    (post) => {
      setSelectedPost(post);
      onOpen();
    },
    [onOpen]
  );

  const closePostEdit = useCallback(() => {
    setSelectedPost(null);
    onClose();
  }, [onClose]);

  const handlePostUpdate = (payload) =>
    updatePostMutation.mutateAsync(payload, {
      onSuccess: () => toast.success("Post updated")
    });

  return (
    <PageTransition>
      <Stack spacing={6}>
        <Stack spacing={1}>
          <Heading size="lg">Search</Heading>
          <Text color={muted}>Find posts by title or people by username.</Text>
        </Stack>

        <HStack spacing={3} align="stretch" flexWrap={{ base: "wrap", md: "nowrap" }}>
          <InputGroup maxW={{ base: "100%", md: "520px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon size={18} />
            </InputLeftElement>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts or usernames" />
          </InputGroup>
          <Select value={sort} onChange={(event) => setSort(event.target.value)} maxW={{ base: "100%", md: "190px" }}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </HStack>

        {searchQuery.isLoading ? (
          <FeedSkeleton />
        ) : hasResults ? (
          <Stack spacing={6}>
            {result.users.length ? (
              <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={4}>
                <Stack spacing={4}>
                  <HStack>
                    <Users size={20} />
                    <Heading size="sm">People</Heading>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {result.users.map((profile) => (
                      <HStack
                        key={profile._id}
                        as={RouterLink}
                        to={`/users/${profile._id}`}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        p={3}
                        spacing={3}
                      >
                        <UserAvatar user={profile} />
                        <Box minW={0}>
                          <Text fontWeight="900" noOfLines={1}>
                            {profile.name}
                          </Text>
                          <Text color={muted} fontSize="sm" noOfLines={1}>
                            @{profile.username || "creator"}
                          </Text>
                        </Box>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Box>
            ) : null}

            {result.posts.length ? (
              <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5} alignItems="start">
                {result.posts.map((post) => (
                  <PostCard
                    key={post._id}
                    currentUser={user}
                    post={post}
                    isActionLoading={commentMutation.isPending || deletePostMutation.isPending}
                    isLikeLoading={likePostMutation.isPending || unlikePostMutation.isPending}
                    onComment={(postId, text) =>
                      commentMutation.mutate({ postId, text }, { onError: (error) => toast.error(getErrorMessage(error)) })
                    }
                    onDelete={(postId) =>
                      deletePostMutation.mutate(postId, {
                        onSuccess: () => toast.success("Post deleted"),
                        onError: (error) => toast.error(getErrorMessage(error))
                      })
                    }
                    onEdit={openPostEdit}
                    onLike={(targetPost) => likePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                    onUnlike={(targetPost) => unlikePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                  />
                ))}
              </SimpleGrid>
            ) : null}
          </Stack>
        ) : (
          <EmptyState
            icon={<SearchIcon size={34} />}
            title="No matches"
            description="Try another title, username, or sorting option."
          />
        )}
      </Stack>
      <UpdateModal
        isOpen={isOpen}
        onClose={closePostEdit}
        post={selectedPost}
        onSubmit={handlePostUpdate}
        isLoading={updatePostMutation.isPending}
      />
    </PageTransition>
  );
}
