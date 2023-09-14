# Git tags

Delete the Existing Tag: You can't directly rename a tag in Git, so you'll need to delete the existing tag and then create a new one with the desired name.

    git tag -d old-tag-name

Create a New Tag: After deleting the old tag, create a new tag with the desired name at the same commit.

    git tag new-tag-name

Push the New Tag: If the old tag was already pushed to the remote repository, you'll need to delete the old tag on the remote as well and then push the new tag.

    git push origin :refs/tags/old-tag-name
    git push origin new-tag-name
