import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import {
  Menu as MenuChakra,
  MenuButton,
  Button,
  Avatar,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logoutUser,
  clearStatus,
  clearUserInfo,
} from "../../app/features/auth/auth-slice";
import {
  clearStatus as clearStatusFeed,
  clearFeedPost,
} from "../../app/features/feed/feed-slice";
import { getUserImage } from "../../app/features/user/user-slice";

const MenuUser = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const id = useAppSelector((state) => state.auth.userInfo.user.id);
  const { isSuccess } = useAppSelector((state) => state.auth.status);

  const imagePath = useAppSelector((state) => state.user.userAllInfo.imagePath);
  console.log("image", imagePath);

  useEffect(() => {
    if (imagePath !== "") {
      dispatch(getUserImage());
    }
  }, [imagePath, dispatch]);

  const onLogout = () => {
    dispatch(logoutUser());
    if (isSuccess) {
      dispatch(clearStatus());
      dispatch(clearUserInfo());
      dispatch(clearStatusFeed());
      dispatch(clearFeedPost());
      router.push("/");
    }
  };

  return (
    <MenuChakra isLazy id="1">
      {/* Property id=1 is needed otherwise will throw error */}
      <MenuButton
        as={Button}
        size="sm"
        rightIcon={<ChevronDownIcon />}
        variant="primary"
      >
        {imagePath ? (
          <Avatar size="sm" bg="brand.500" src={imagePath} />
        ) : (
          <Avatar size="sm" bg="brand.500" />
        )}
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Link href={`/profile/${id}`}>Profile</Link>
        </MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </MenuList>
    </MenuChakra>
  );
};
export default MenuUser;
