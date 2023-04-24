import cls from "classnames";
import styles from "";
import {Divider} from "rsuite";
const ChatRecordItem = ({sendId, sendTime, content, selected}) => {
    const [userInfo] = [];
    if(!userInfo) return null;
    let selectedClassName = styles["chat-record-item-selected"];
    return (
        <div>
            <div
                className={cls(styles["chat-record-item"], {
                    [selectedClassName]: selected,
                })}>
                <div className={styles["chat-user-info"]}>
                    <div className={styles.top}>
                        <p className={styles["chat-user-name"]}>
                            {userInfo.username || ""}
                        </p>
                        <span className={styles.time}>{sendTime}</span>
                    </div>
                    <div className={styles["chat-message-detail-item"]}>
                        <p className={styles["chat-message-detail"]}> {content}</p>
                    </div>
                </div>
            </div>
            <Divider style={{margin: 0}}/>
        </div>
    );
};

export default ChatRecordItem;