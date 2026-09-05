import { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { varAlpha } from '../../styles';

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

export const colorByName = (name) => {
  if (!name || name === 'undefined' || name === 'null') return 'default';
  const clean = `${name}`.trim().toLowerCase();
  if (!clean) return 'default';

  const char = clean.charAt(0);

  if (['a', 'c', 'f', 'g'].includes(char)) return 'primary';
  if (['d', 'e', 'h', 'b'].includes(char)) return 'secondary';
  if (['i', 'k', 'l', 'j'].includes(char)) return 'info';
  if (['m', 'n', 'p', 'o', 'u'].includes(char)) return 'success';
  if (['q', 's', 't', 'r', 'w'].includes(char)) return 'warning';
  if (['v', 'x', 'y', 'z'].includes(char)) return 'error';

  let hash = 0;
  for (let i = 0; i < clean.length; i += 1) {
    hash = (clean.charCodeAt(i) + hash * 31) % 1000000;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

// ----------------------------------------------------------------------

const avatarColors = {
  colors: COLORS.map((color) => ({
    props: ({ ownerState }) => ownerState.color === color,
    style: ({ theme }) => ({
      color: theme.vars.palette[color].contrastText,
      backgroundColor: theme.vars.palette[color].main,
    }),
  })),
  defaultColor: [
    {
      props: ({ ownerState }) => ownerState.color === 'default',
      style: ({ theme }) => ({
        color: theme.vars.palette.text.secondary,
        backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
      }),
    },
  ],
};

const MuiAvatar = {
  /** **************************************
   * VARIANTS
   *************************************** */
  variants: [...[...avatarColors.defaultColor, ...avatarColors.colors]],

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    rounded: ({ theme }) => ({ borderRadius: theme.shape.borderRadius * 1.5 }),
    colorDefault: ({ ownerState, theme }) => {
      const name =
        ownerState.alt ||
        (typeof ownerState.children === 'string' ? ownerState.children : '');

      const isSurplus =
        typeof ownerState.children === 'string' && ownerState.children.trim().startsWith('+');

      if (isSurplus) {
        return {
          color: theme.vars.palette.primary.dark,
          backgroundColor: theme.vars.palette.primary.lighter,
        };
      }

      const color = colorByName(`${name}`);

      return {
        ...(!!name &&
          name !== 'undefined' &&
          name !== 'null' && {
            ...(color !== 'default'
              ? {
                  color: theme.vars.palette[color].contrastText,
                  backgroundColor: theme.vars.palette[color].main,
                }
              : {
                  color: theme.vars.palette.text.secondary,
                  backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.24),
                }),
          }),
      };
    },
  },
};

// ----------------------------------------------------------------------

const MuiAvatarGroup = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { max: 4 },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ ownerState }) => ({
      justifyContent: 'flex-end',
      ...(ownerState.variant === 'compact' && {
        width: 40,
        height: 40,
        position: 'relative',
        [`& .${avatarGroupClasses.avatar}`]: {
          margin: 0,
          width: 28,
          height: 28,
          position: 'absolute',
          '&:first-of-type': { left: 0, bottom: 0, zIndex: 9 },
          '&:last-of-type': { top: 0, right: 0 },
        },
      }),
    }),
    avatar: ({ theme }) => ({
      fontSize: 16,
      fontWeight: theme.typography.fontWeightSemiBold,
      '&:first-of-type': {
        fontSize: 12,
      },
    }),
  },
};

// ----------------------------------------------------------------------

export const avatar = { MuiAvatar, MuiAvatarGroup };
