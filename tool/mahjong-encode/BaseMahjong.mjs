export class BaseMahjong {
    static cards = ["🀀", "🀁", "🀂", "🀃", "🀄", "🀅", "🀆", "🀇", "🀈", "🀉", "🀊", "🀋", "🀌", "🀍", "🀎", "🀏", "🀐", "🀑", "🀒", "🀓", "🀔", "🀕", "🀖", "🀗", "🀘", "🀙", "🀚", "🀛", "🀜", "🀝", "🀞", "🀟", "🀠", "🀡"];
    static cardIndices = new Map([["🀀", 0], ["🀁", 1], ["🀂", 2], ["🀃", 3], ["🀄", 4], ["🀅", 5], ["🀆", 6], ["🀇", 7], ["🀈", 8], ["🀉", 9], ["🀊", 10], ["🀋", 11], ["🀌", 12], ["🀍", 13], ["🀎", 14], ["🀏", 15], ["🀐", 16], ["🀑", 17], ["🀒", 18], ["🀓", 19], ["🀔", 20], ["🀕", 21], ["🀖", 22], ["🀗", 23], ["🀘", 24], ["🀙", 25], ["🀚", 26], ["🀛", 27], ["🀜", 28], ["🀝", 29], ["🀞", 30], ["🀟", 31], ["🀠", 32], ["🀡", 33]]);
    
    static encode(str) {
        const bytes = new TextEncoder().encode(str);
        const indices = [];
        for (let i = 0; i < bytes.length; i += 5) {
            const blockBytes = [];
            // 每 5 个字节编码成 8 个麻将牌
            for (let j = i; j < i + 5; ++j) {
                // 越界部分填充 0
                const byte = j < bytes.length ? bytes[j] : 0;
                blockBytes.push(byte);
            }
            indices.push(
                (blockBytes[0] & 0xf8) >> 3,
                ((blockBytes[0] & 0x07) << 2) | ((blockBytes[1] & 0xc0) >> 6),
                (blockBytes[1] & 0x3e) >> 1,
                ((blockBytes[1] & 0x01) << 4) | ((blockBytes[2] & 0xf0) >> 4),
                ((blockBytes[2] & 0x0f) << 1) | ((blockBytes[3] & 0x80) >> 7),
                (blockBytes[3] & 0x7c) >> 2,
                ((blockBytes[3] & 0x03) << 3) | ((blockBytes[4] & 0xe0) >> 5),
                (blockBytes[4] & 0x1f),
            );
        }
        // 增加对齐牌(8 饼)
        const paddingLength = (5 - (bytes.length % 5)) % 5;
        for (let i = 0; i !== paddingLength; ++i) {
            indices.push(32);
        }

        return indices.map((i) => this.cards[i]).join("");
    }

    static decode(str) {
        const bytes = [];

        const indices = [];
        for (const c of str) {
            indices.push(this.cardIndices.get(c));
        }
        // 扣除对齐量
        let realLength = 0;
        for (let i = indices.length - 1; i >= 0; --i) {
            if (indices[i] !== 32) {
                realLength = i + 1;
                break;
            }
        }
        if (realLength % 8 !== 0) {
            throw new Error("参数值非法");
        }

        const paddingLength = indices.length - realLength;
        const realByteLength = realLength / 8 * 5 - paddingLength;

        for (let i = 0; i < realLength; i += 8) {
            // 每 8 个麻将牌解码成 5 个字节
            const blockBytes = [
                (indices[i] << 3) | (indices[i + 1] >> 2),
                ((indices[i + 1] & 0x03) << 6) | (indices[i + 2] << 1) | (indices[i + 3] >> 4),
                ((indices[i + 3] & 0x0f) << 4) | (indices[i + 4] >> 1),
                ((indices[i + 4] & 0x01) << 7) | (indices[i + 5] << 2) | (indices[i + 6] >> 3),
                ((indices[i + 6] & 0x07) << 5) | indices[i + 7]
            ];
            for (const byte of blockBytes) {
                if (bytes.length < realByteLength) {
                    // 非填充字节
                    bytes.push(byte);
                }
            }
        }

        const bytesBuffer = new Uint8Array(bytes).buffer;
        return new TextDecoder().decode(bytesBuffer);
    }
}