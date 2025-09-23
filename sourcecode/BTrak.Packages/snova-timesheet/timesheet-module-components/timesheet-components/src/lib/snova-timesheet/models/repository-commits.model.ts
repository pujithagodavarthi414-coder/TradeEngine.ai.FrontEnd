export class RepositoryCommitsModel {
    fromSource: string;
    commiterEmail: string;
    commiterName: string;
    commitMessage: string;
    commitReferenceUrl: string;
    filesModified: string[];
    filesAdded: string[];
    filesRemoved: string[];
    filesModifiedCount: number;
    filedAddedCount: number;
    filesRemovedCount: number;
    repositoryName: string;
    commiterUserId: string;
    totalCount: number;
    createdDateTime: Date;
}