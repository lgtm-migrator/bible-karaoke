import React from "react";
import { useObserver } from "mobx-react";
import _ from "lodash";
import { Flex } from "reflexbox";
import { Intent, Alignment } from "@blueprintjs/core";
import { H3, Checkbox, Button, Card } from "../blueprint";
import { useStores } from "../store";
import { getChapterDisplayName } from "../util";

export default function ChapterSelector(props: any): JSX.Element {
  const { appState } = useStores();
  return useObserver(() => {
    const book = _.get(appState.projects, ["activeProject", "activeBook"]);
    return (
      <Card {...props}>
        {!!book && (
          <React.Fragment>
            <Flex alignItems="center" justifyContent="space-between">
              <H3>{book.name}</H3>
              <Checkbox
                label={book.allSelected ? "Un-select all" : "Select all"}
                alignIndicator={Alignment.RIGHT}
                onChange={(): void => {
                  book.toggleAllChapters();
                }}
                checked={book.allSelected}
                indeterminate={book.isSelected && !book.allSelected}
              />
            </Flex>
            <Flex flexWrap="wrap" m={-1}>
              {book.chapterList.map((chapter: any) => (
                <Button
                  m={1}
                  key={chapter.name}
                  intent={chapter.isSelected ? Intent.PRIMARY : undefined}
                  onClick={(): void => {
                    chapter.toggleIsSelected();
                  }}
                >
                  {getChapterDisplayName(chapter.name)}
                </Button>
              ))}
            </Flex>
          </React.Fragment>
        )}
      </Card>
    );
  });
}
